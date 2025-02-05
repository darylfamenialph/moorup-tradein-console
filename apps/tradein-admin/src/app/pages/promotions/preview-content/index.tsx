/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ADD_PROMOTION_CLAIMS_PAYLOAD,
  ADD_PROMOTION_CONDITIONS_PAYLOAD,
  ADD_PROMOTION_DETAILS_PAYLOAD,
  ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  ADD_PROMOTION_STEPS_PAYLOAD,
  AppButton,
  FaqInterface,
  Flex,
  FormGroup,
  Grid,
  GridItem,
  HTMLRenderer,
  MODAL_TYPES,
  PromotionConditionItemInterface,
  PromotionProductInterface,
  PromotionStepsInterface,
  PromotionTypes,
  getCurrencySymbol,
  useCommon,
  usePromotion,
} from '@tradein-admin/libs';
import { Fragment, useState } from 'react';
import styled from 'styled-components';

const StyledText = styled.span<{
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
}>`
  ${(props) => props.color && `color: ${props.color};`}
  ${(props) => props.fontWeight && `font-weight: ${props.fontWeight};`}
  ${(props) => props.fontSize && `font-size: ${props.fontSize};`}
  ${(props) => props.margin && `margin: ${props.margin};`}
  ${(props) => props.marginTop && `margin-top: ${props.marginTop};`}
  ${(props) => props.marginBottom && `margin-bottom: ${props.marginBottom};`}
  ${(props) => props.marginLeft && `margin-left: ${props.marginLeft};`}
  ${(props) => props.marginRight && `margin-right: ${props.marginRight};`}
  ${(props) => props.lineHeight && `line-height: ${props.lineHeight};`}
`;

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.1);
`;

const AccordionHeader = styled.div<{ isOpen?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
`;

const AccordionContent = styled.div<{ isOpen?: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: 20px;
`;

const StyledIcon = styled(FontAwesomeIcon)<{
  color?: string;
  hovercolor?: string;
  disabled?: boolean;
}>`
  color: ${(props) => (props.color ? props.color : 'inherit')};
  margin: 0 12px;

  &:hover {
    color: ${(props) => (props.hovercolor ? props.hovercolor : 'inherit')};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

const ImageContainer = styled.div`
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  margin-bottom: 5rem;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const ConditionContainer = styled.div`
  display: grid;
  grid-template-columns: 20px auto;
`;

export function PromotionPreview() {
  const {
    state: promotionState,
    createPromotion,
    clearPromotions,
    setAddPromotionDetailsPayload,
    setAddPromotionClaimsPayload,
    setAddPromotionStepsPayload,
    setAddPromotionConditionPayload,
    setAddPromotionEligibilityAndFaqsPayload,
    updatePromotion,
  } = usePromotion();
  const {
    addPromotionDetailsPayload,
    addPromotionClaimsPayload,
    addPromotionStepsPayload,
    addPromotionConditionPayload,
    addPromotionEligibilityAndFaqsPayload,
    promotionCardImage,
    promotionBannerImage,
  } = promotionState;

  const {
    state: commonState,
    setSideModalState,
    setCenterModalState,
  } = useCommon();
  const { sideModalState, centerModalState } = commonState;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (item: number) => {
    setOpenIndex((prev) => (prev === item ? null : item));
  };

  const payload = {
    ...addPromotionDetailsPayload,
    is_draft: false,
    claims: addPromotionClaimsPayload,
    steps: addPromotionStepsPayload,
    conditions: addPromotionConditionPayload,
    eligibility: addPromotionEligibilityAndFaqsPayload,
  };

  const handleCloseModal = () => {
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });

    setCenterModalState({
      ...centerModalState,
      open: false,
      view: null,
    });

    // Clear forms on submit
    setAddPromotionDetailsPayload(ADD_PROMOTION_DETAILS_PAYLOAD);
    setAddPromotionClaimsPayload(ADD_PROMOTION_CLAIMS_PAYLOAD);
    setAddPromotionStepsPayload(ADD_PROMOTION_STEPS_PAYLOAD);
    setAddPromotionConditionPayload(ADD_PROMOTION_CONDITIONS_PAYLOAD);
    setAddPromotionEligibilityAndFaqsPayload(
      ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
    );
  };

  return (
    <Flex>
      <Flex center>
        {/* Promotion Name */}
        <StyledText
          marginTop="1rem"
          color="#6b7280"
          fontSize="2.25rem"
          fontWeight="700"
          lineHeight="2.5rem"
        >
          {addPromotionDetailsPayload?.name}
        </StyledText>

        {/* Promotion Image */}
        <ImageContainer>
          <Image
            src={
              promotionCardImage
                ? URL?.createObjectURL(promotionCardImage)
                : addPromotionDetailsPayload.image_url
            }
            alt="promotion-image"
          />
        </ImageContainer>
        {/* for debug purposes */}
        {/* <ImageContainer>
          <Image
            src={
              promotionBannerImage
                ? URL?.createObjectURL(promotionBannerImage)
                : addPromotionDetailsPayload.banner_url
            }
            alt="promotion-banner"
          />
        </ImageContainer> */}
      </Flex>

      {/* Promotion Steps */}
      {addPromotionDetailsPayload?.type === PromotionTypes.REGULAR && (
        <Grid columns="4">
          {addPromotionStepsPayload?.steps?.map(
            (step: PromotionStepsInterface, index: number) => {
              return (
                <Fragment key={index}>
                  <GridItem>
                    <StyledText
                      marginBottom="1rem"
                      fontWeight="700"
                      fontSize="1.25rem"
                    >{`Step ${step?.order}`}</StyledText>
                    <StyledText
                      marginBottom="1rem"
                      color="#005190"
                      fontWeight="700"
                      fontSize="1.25rem"
                    >
                      {step?.title}
                    </StyledText>
                    <StyledText fontSize="0.875rem">
                      <HTMLRenderer htmlContent={step?.description} />
                    </StyledText>
                  </GridItem>
                </Fragment>
              );
            },
          )}
        </Grid>
      )}
      {/* Promotion Description */}
      <Flex>
        <StyledText marginTop="2rem" marginBottom="2rem">
          <HTMLRenderer htmlContent={addPromotionDetailsPayload?.description} />
        </StyledText>
      </Flex>

      {/* Promotion Claims */}
      <Flex>
        <StyledText
          marginBottom="1rem"
          color="#005190"
          fontWeight="700"
          fontSize="1.5rem"
        >
          {addPromotionClaimsPayload?.title}
        </StyledText>
        <StyledText marginBottom="1.5rem">
          <HTMLRenderer htmlContent={addPromotionClaimsPayload?.description} />
        </StyledText>
        <div style={{ margin: '0rem 3rem' }}>
          <Grid columns="2" gap="0px">
            {addPromotionClaimsPayload?.products?.map(
              (product: PromotionProductInterface, index: number) => {
                return (
                  <Fragment key={index}>
                    <GridItem padding="20px" border="1px solid #ececec">
                      <StyledText fontWeight="700">
                        {product?.product_name}
                      </StyledText>
                    </GridItem>
                    <GridItem padding="20px" border="1px solid #ececec">
                      <StyledText>{`${getCurrencySymbol(product?.currency)}${product?.amount}`}</StyledText>
                    </GridItem>
                  </Fragment>
                );
              },
            )}
          </Grid>
        </div>
        <StyledText marginTop="1.5rem" marginBottom="1.5rem">
          {addPromotionClaimsPayload?.disclaimer}
        </StyledText>
      </Flex>

      {/* Conditions */}
      <Flex>
        <StyledText
          marginBottom="1rem"
          color="#005190"
          fontWeight="700"
          fontSize="1.5rem"
        >
          {addPromotionConditionPayload?.title}
        </StyledText>
        {addPromotionConditionPayload?.items?.map(
          (item: PromotionConditionItemInterface, index: number) => {
            return (
              <Fragment key={index}>
                <ConditionContainer>
                  <StyledText
                    marginLeft="1rem"
                    marginTop="1rem"
                  >{`${item?.order}.`}</StyledText>
                  <HTMLRenderer htmlContent={item?.description} />
                </ConditionContainer>
              </Fragment>
            );
          },
        )}
      </Flex>

      {/* Eligibility and FAQs */}
      <Flex>
        <StyledText
          marginTop="2rem"
          marginBottom="1rem"
          color="#005190"
          fontWeight="700"
          fontSize="1.5rem"
        >
          {addPromotionEligibilityAndFaqsPayload?.title}
        </StyledText>
        <AccordionContainer>
          {addPromotionEligibilityAndFaqsPayload?.faq?.map(
            (faq: FaqInterface, index: number) => {
              return (
                <Fragment key={index}>
                  <AccordionHeader
                    onClick={() => toggleAccordion(index)}
                    isOpen={openIndex === index}
                  >
                    <StyledText
                      fontWeight="500"
                      fontSize="1.25rem"
                      lineHeight="1.75rem"
                    >
                      {faq?.title}
                    </StyledText>
                    <StyledIcon
                      icon={openIndex === index ? faAngleDown : faAngleUp}
                      color={openIndex === index ? 'inherit' : '#ccc'}
                    />
                  </AccordionHeader>
                  <AccordionContent isOpen={openIndex === index} key={index}>
                    <HTMLRenderer htmlContent={faq?.content} />
                  </AccordionContent>
                </Fragment>
              );
            },
          )}
        </AccordionContainer>
      </Flex>

      <Flex>
        <div className="mx-[300px] p-5 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
          Please complete all fields to publish the promotion.
        </div>
      </Flex>

      <Flex center>
        <FormGroup>
          <AppButton
            type="button"
            variant="outlined"
            width="fit-content"
            onClick={() => handleCloseModal()}
          >
            Discard
          </AppButton>
          <AppButton
            type="button"
            variant="fill"
            width="fit-content"
            onClick={() => {
              if (centerModalState.view === MODAL_TYPES.ADD_PROMOTION_PREVIEW) {
                createPromotion(
                  payload,
                  promotionCardImage,
                  promotionBannerImage,
                );
                clearPromotions({});
              } else {
                updatePromotion(
                  payload,
                  centerModalState?.data,
                  promotionCardImage,
                  promotionBannerImage,
                );
                clearPromotions({});
              }

              handleCloseModal();
            }}
          >
            Click to Submit
          </AppButton>
        </FormGroup>
      </Flex>
    </Flex>
  );
}
