/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Loader } from '../loader';

interface DropzoneProps {
  icon?: string;
  content: any;
  fileTypes?: string[];
  processFile: any;
  disabled?: boolean;
  processing?: boolean;
}

const DropzoneContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 100%;
  min-height: 115px;
  border: 2px dashed #dfdfdf;
  background: #fafafa;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 6px;
`;

const DropzoneContent = styled.div`
  padding: 2em 0;
  text-align: center;
  width: 100%;
`;

const DropzoneText = styled.div`
  text-align: center;
  color: #9c9c9c;
  font-weight: 700;
  font-size: 14px;
  padding-top: 10px;
`;

const InputFile = styled.input`
  display: none;
`;

const whenProcessing = (processing?: boolean) => processing && <Loader />;

export function Dropzone({
  icon,
  content,
  fileTypes,
  processFile,
  disabled,
  processing,
}: DropzoneProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const fileInputClicked = () => inputFileRef.current?.click();

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(processFile);
  };

  const filesSelected = () => {
    if (inputFileRef.current?.files?.length) {
      handleFiles(inputFileRef.current.files);
    }
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefault(e);
    const { files } = e.dataTransfer;
    if (files.length) {
      handleFiles(files);
    }
  };

  return (
    <DropzoneContainer
      onDragOver={preventDefault}
      onDragEnter={preventDefault}
      onDragLeave={preventDefault}
      onDrop={(e) => {
        preventDefault(e);
        if (disabled || processing) return;
        fileDrop(e);
      }}
      disabled={disabled || processing}
    >
      {whenProcessing(processing) || (
        <DropzoneContent
          onClick={(e) => {
            if (disabled || processing) return;
            fileInputClicked();
          }}
        >
          {!!icon && <img src={icon} alt="icon" />}
          <DropzoneText>{content}</DropzoneText>
          <InputFile
            ref={inputFileRef}
            type="file"
            multiple
            onChange={filesSelected}
            accept={fileTypes?.join()}
          />
        </DropzoneContent>
      )}
    </DropzoneContainer>
  );
}
