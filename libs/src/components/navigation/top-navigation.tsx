/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { default as Select } from 'react-select'
import styled from 'styled-components'
import { ACTIVE_PLATFORM, PLATFORMS } from '../../constants'
import { capitalizeFirstLetter } from '../../helpers'
import { useAuth, useCommon } from '../../store'
import { StyledIcon } from '../styled'
import { withChild } from '../with-child'

const NavbarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 998;
`
const NavbarWrapper = styled.div`
  height: 100%;
  padding: 8px 20px;
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

const HamburgerIconContainer = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

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
    boxShadow: 'rgba(0, 0, 0, 0.2) 8px 8px 16px 0px;',
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

const WCSelect = withChild(Select);

export function TopNavBar(): JSX.Element {
  const { state, setActivePlatform } = useAuth()
  const { activePlatform, userDetails } = state

  const { state: commonState, setShowSideNav } = useCommon();
  const { showSideNav } = commonState;

  const platforms = userDetails?.platforms
    ?.map((item: any) => ({
      value: item,
      label: PLATFORMS[item],
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <TopLeft>
          {
            !showSideNav && (
              <HamburgerIconContainer onClick={() => setShowSideNav(!showSideNav)}>
                <StyledIcon icon={faBars} color='#ccc' hovercolor='#01463a' />
              </HamburgerIconContainer>
            )
          }
        </TopLeft>
        <TopRight>
          {
            platforms?.length > 1 ? (
              <WCSelect
                name="activePlatform"
                isMulti={false}
                styles={customStyles()}
                options={platforms}
                placeholder="Select platform"
                value={platforms?.find((option: any) => activePlatform === option?.value) || null}
                onChange={(selectedOption: any) => {
                  setActivePlatform(selectedOption.value)
                  localStorage.setItem(ACTIVE_PLATFORM, selectedOption.value)
                }}
              />
            ) : (
              <StyledText>
                {capitalizeFirstLetter(activePlatform)}
              </StyledText>
            )
          }
          {/* <Avatar
            initials={getInitials(
              userDetails?.first_name + ' ' + userDetails?.last_name,
            )}
          /> */}
        </TopRight>
      </NavbarWrapper>
    </NavbarContainer>
  )
}
