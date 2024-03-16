/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as Select } from 'react-select'
import styled from 'styled-components'
import { capitalizeFirstLetter, getInitials } from '../../helpers'
import { useAuth } from '../../store'
import { Avatar } from '../avatar'
import { useEffect } from 'react'

const NavbarContainer = styled.div`
  width: 100%;
  height: 45px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 998;
`
const NavbarWrapper = styled.div`
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
`

const TopLeft = styled.div`
  margin-right: auto;
`
const TopRight = styled.div`
  display: flex;
  align-items: center;
`

const StyledText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #01463A;
`

const customStyles = () => ({
  control: (provided: any) => ({
    ...provided,
    border: '0px',
    borderRadius: '4px',
    transition: 'border-color 0.2s ease-in-out',
    boxShadow: 'none',
    width: '100%',
    fontSize: '14px',
    minWidth: '200px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    background: state.isFocused ? 'rgba(1, 70, 58, 0.8)' : state.isSelected ? '#01463A' : undefined,
    color: state.isFocused ? '#fff' : state.isSelected ? '#fff' : 'inherit',
    zIndex: 1,
    ':hover': {
      color: '#fff',
    },
    ':active': {
      color: '#fff',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: '14px',
    color: '#ccc'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontSize: '16px',
    fontWeight: '700',
    color: '#01463A',
  }),
});

export function TopNavBar(): JSX.Element {
  const { state, getPlatformConfig,  setActivePlatform } = useAuth()
  const { activePlatform, userDetails } = state

  useEffect(() => {
    if(activePlatform) {
      getPlatformConfig(activePlatform);
    }
  }, [activePlatform]);

  const platforms = userDetails?.platforms
    ?.map((item: any) => ({
      value: item,
      label: capitalizeFirstLetter(item),
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <TopLeft>
          {
            platforms?.length > 1 ? (
              <Select
                name="activePlatform"
                isMulti={false}
                styles={customStyles()}
                options={platforms}
                placeholder="Select platform"
                value={platforms?.find((option: any) => activePlatform === option?.value) || null}
                onChange={(selectedOption) => {
                  setActivePlatform(selectedOption.value)
                }}
              />
            ) : (
              <StyledText>
                {capitalizeFirstLetter(activePlatform)}
              </StyledText>
            )
          }
        </TopLeft>
        <TopRight>
          <Avatar
            initials={getInitials(
              userDetails?.first_name + ' ' + userDetails?.last_name,
            )}
          />
        </TopRight>
      </NavbarWrapper>
    </NavbarContainer>
  )
}
