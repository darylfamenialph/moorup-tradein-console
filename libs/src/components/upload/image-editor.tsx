/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, isUndefined } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import styled from 'styled-components';
import { defaultTheme, getCroppedImg } from '../../helpers';
import { AppButton } from '../button';
import { FormGroup } from '../form';
import { Slider } from '../slider';
import { Typography } from '../typography';
import { withChild } from '../with-child';

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;
interface ImageEditorProps {
  onImageChange: (image: string, fileName: string) => void;
  label: string;
  name: string;
  aspectRatio: any;
  image?: string;
  removeImage?: boolean
}

const WCInput = withChild(StyledInput);

export function ImageEditor({ 
  onImageChange, 
  aspectRatio, 
  label, 
  name,
  image = '',
  removeImage = false
}: ImageEditorProps) {
  const [selectedImageURL, setSelectedImageURL] = useState<string>(image);
  const [selectedImageFileName, setSelectedImageFileName] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null)
  const [croppedImage, setCroppedImage] = useState<string>(image);

  const [fieldError, setFieldError] = useState<boolean>(false);
  const [fieldErrorMessage, setFieldErrorMessage] = useState<string>('');

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImageFileName(acceptedFiles[0].name);
      setSelectedImageURL(URL.createObjectURL((acceptedFiles[0])));
      setVisible(true);
    } else {
      const rejectedFilesError = rejectedFiles[0].errors;

      switch (rejectedFilesError[0].code) {
        case ErrorCode.FileInvalidType:
          setFieldError(true);
          setFieldErrorMessage('Unsupported File Type: We only accept JPEG or PNG files. Please upload a file with either a .jpeg, .jpg, or .png extension.')
          break;

        case ErrorCode.FileTooLarge:
          setFieldError(true);
          setFieldErrorMessage('Sorry, Your File is Too Large: The maximum allowed file size is 1MB. Please choose a smaller file to upload.')
          break;
      
        default:
          setFieldError(true);
          setFieldErrorMessage('Something went wrong, please try a different file.')
          break;
      }

    }
  };

  const discardImage = () => {
    setCroppedImage('');
    setSelectedImageURL('');
    setSelectedImageFileName('');
    setVisible(false);
    setZoom(1);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 1048576, // 1MB
  });

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImageURL,
        croppedAreaPixels,
        rotation
      )
      
      onImageChange(croppedImage, selectedImageFileName);
      setCroppedImage(croppedImage);
      setSelectedImageURL(croppedImage);
      setVisible(false);
      setZoom(1);
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation, selectedImageURL]);

  useEffect(() => {
    if(removeImage) {
      discardImage()
    }
  },[removeImage])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <StyledInputLabel>{label}</StyledInputLabel>
      <FileSelect error={fieldError} {...getRootProps()} onBlur={() => {
          if (isEmpty(selectedImageFileName) && isEmpty(image)) {
            if (isEmpty(fieldErrorMessage)) {
              setFieldError(true);
              setFieldErrorMessage('This field is required.');
            }
          } else {
            setFieldError(false);
            setFieldErrorMessage('');
          }
        }}>
        <WCInput {...getInputProps()} name={name} />
        <AppButton id='slider' variant='fill' type='button' width='fit-content' padding='4px 12px'>{croppedImage ? 'Replace' : 'Choose File'}</AppButton>
        <Typography variant='body2' color='#ccc'>{selectedImageFileName || image}</Typography>
        {
          croppedImage && (
            <div style={{ maxHeight: '36px', marginLeft: 'auto' }}>
              <Image src={croppedImage} alt='' />
            </div>
          )
        }
      </FileSelect>
      {(!isUndefined(fieldError) && fieldError && <ErrorMessage>{fieldErrorMessage}</ErrorMessage>)}
      {
        visible && (
          <ModalContainer>
            <Container onClick={(e) => e.stopPropagation()}>
              {selectedImageURL && (
                <>
                  <FormGroup>
                    <Typography variant='subtitle2' color={defaultTheme.primary.text}>Adjust Image</Typography>
                  </FormGroup>
                  <ImageContainer>
                    <StyledCropper
                      image={selectedImageURL}
                      crop={crop}
                      rotation={rotation}
                      zoom={zoom}
                      aspect={aspectRatio}
                      onCropChange={setCrop}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </ImageContainer>
                  <Slider label='Zoom' min={1} max={3} step={0.1} value={zoom} onChange={(value) => setZoom(value)} />
                  <FormGroup marginBottom='20px' marginTop='20px'>
                    <AppButton width='100px' variant='outlined' type="button" onClick={discardImage}>
                      Discard
                    </AppButton>
                    <AppButton width='100px' type="button" onClick={showCroppedImage}>
                      Save
                    </AppButton>
                  </FormGroup>
                </>
              )}
            </Container>
          </ModalContainer>
        )
      }
    </div>
  )
}

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  height: 100vh;
  width: 100vw;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: auto;
  height: 2rem;
  display: block;
  object-fit: cover;
  align-self: center;
`;

const StyledCropper = styled<any>(Cropper)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StyledInputLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

const FileSelect = styled.div<{ error?: boolean, name?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${(props) => (isUndefined(props.error) ? '20px' : '0px')};
  border: 1px solid ${(props) => (props.error ? '#f44336' : '#ccc')};
  border-radius: 4px;
  outline: none;
  padding: 4px;
  transition: border-color 0.2s ease-in-out;

  &:focus, &:hover {
    border-color: #01463a;
  }
`;
