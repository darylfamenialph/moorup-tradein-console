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
import { withChild } from '../with-child';

interface CustomEditorProps {
  value: any;
  label: string;
  error?: boolean;
  errorMessage?: string;
  name: string;
  onBlur?: any;
  onChange: any;
  id?: string;
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

const WCEditor = withChild(Editor)

export function CustomEditor({ 
  value,
  label,
  error,
  errorMessage,
  name,
  onBlur,
  onChange,
  id,
  ...props
}: CustomEditorProps) {
  return (
    <EditorProvider>
      <StyledInputContainer>
        <StyledInputLabel>{label}</StyledInputLabel>
        <WCEditor
          id={id}
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
        </WCEditor>
        {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </StyledInputContainer>
    </EditorProvider>
  );
}
