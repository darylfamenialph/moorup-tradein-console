/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnNumberedList,
  Editor,
  EditorProvider,
  Toolbar
} from 'react-simple-wysiwyg';
import styled from 'styled-components';

interface CustomEditorProps {
  value: any;
  label: string;
  error?: boolean;
  errorMessage?: string;
  name: string;
  onBlur?: any;
  onChange: any;
}

const StyledInputContainer = styled.div<{ error?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.error ? '0px' : '20px')};
  width: 100%;
`;

const StyledInputLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
`;

export function CustomEditor({ 
  value,
  label,
  error,
  errorMessage,
  name,
  onBlur,
  onChange,
  ...props
}: CustomEditorProps) {
  return (
    <EditorProvider>
      <StyledInputContainer>
        <StyledInputLabel>{label}</StyledInputLabel>
        <Editor
          containerProps={{ style: { 
            width: '100%', 
            borderColor: error ? '#f44336' : 'inherit',
            fontSize: '14px',
          }}}
          name={name}
          value={value} 
          onBlur={onBlur}
          onChange={onChange}
          {...props}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnNumberedList />
            <BtnBulletList />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
        {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </StyledInputContainer>
    </EditorProvider>
  );
}
