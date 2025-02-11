import styled, { css } from 'styled-components';
import { withChild } from '../with-child';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  rounded?: boolean;
  block?: boolean;
  color?: string;
  btnType?: 'solid' | 'outline' | 'default' | 'dark';
  size?: 'small' | 'medium' | 'large' | 'full';
}

const getSizeStyles = (size: string | undefined) => {
  switch (size) {
    case 'small':
      return css`
        font-size: 0.875rem;
        font-weight: 400;
        padding: 4px 12px;
        border-radius: 6px;
      `;
    case 'large':
      return css`
        font-size: 1.125rem;
        font-weight: 600;
        padding: 12px 32px;
        border-radius: 8px;
      `;
    case 'full':
      return css`
        font-size: 1.125rem;
        font-weight: 600;
        padding: 12px 32px;
        border-radius: 9999px;
        width: 100%;
      `;
    default: // medium
      return css`
        font-size: 1rem;
        font-weight: 500;
        padding: 8px 24px;
        border-radius: 6px;
      `;
  }
};

const getButtonTypeStyles = (btnType: string | undefined) => {
  switch (btnType) {
    case 'default':
      return css`
        color: #4b5563;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;

        &:hover {
          background-color: #e5e7eb;
        }

        &:disabled {
          background-color: #e5e7eb;
          color: #9ca3af;
        }
      `;
    case 'dark':
      return css`
        color: white;
        background-color: #1f2937;
        border: 1px solid #1f2937;

        &:hover {
          background-color: #374151;
        }

        &:disabled {
          background-color: #4b5563;
        }
      `;
    case 'outline':
      return css`
        color: #6b7280;
        background-color: transparent;
        border: 1px solid #6b7280;

        &:hover {
          color: white;
          background-color: #6b7280;
        }

        &:disabled {
          background-color: #e5e7eb;
          color: #9ca3af;
          border-color: #9ca3af;
        }
      `;
    default: // solid
      return css`
        color: white;
        background-color: #6b7280;
        border: 1px solid #6b7280;

        &:hover {
          background-color: #4b5563;
        }

        &:disabled {
          background-color: #9ca3af;
          color: white;
        }
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;

  ${(props) => getSizeStyles(props.size)}
  ${(props) => getButtonTypeStyles(props.btnType)}

  ${(props) =>
    props.block &&
    css`
      width: 100%;
    `}

  &:disabled {
    cursor: not-allowed;
  }
`;

const WCButton = withChild(StyledButton);

export function Button({ title, children, size = 'medium', btnType = 'solid', block = false, onClick, ...props }: ButtonProps): JSX.Element {
  return (
    <WCButton size={size} btnType={btnType} block={block} onClick={onClick} {...props}>
      {children || title}
    </WCButton>
  );
}
