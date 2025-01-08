import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ANNOUNCEMENT_MODAL,
  Button,
  GenericModal,
  useAuth,
} from '@tradein-admin/libs';

export function AnnouncementModal() {
  const { state: authState } = useAuth();
  const { platformConfig } = authState;
  const omcAnnouncementPopup = platformConfig?.omcAnnouncementPopup ?? {};
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);

  const handleClose = () => {
    setOpenAnnouncementModal(false);
    localStorage.setItem(
      ANNOUNCEMENT_MODAL,
      JSON.stringify({
        isOpen: false,
        date: new Date(omcAnnouncementPopup?.updatedAt).toISOString(),
      }),
    );
  };

  useEffect(() => {
    const announcementPopupLocalState = JSON.parse(
      localStorage.getItem(ANNOUNCEMENT_MODAL) ?? '{}',
    );
    if (
      !announcementPopupLocalState?.date ||
      new Date(omcAnnouncementPopup?.updatedAt) >
        new Date(announcementPopupLocalState?.date)
    ) {
      setOpenAnnouncementModal(true);
    }
  }, [omcAnnouncementPopup]);

  return (
    <GenericModal
      isOpen={openAnnouncementModal}
      onClose={handleClose}
      title={omcAnnouncementPopup?.headerText}
      content={
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: omcAnnouncementPopup?.context ?? '',
            }}
          />
          {omcAnnouncementPopup?.url && (
            <p className="mt-4">
              For more information, please visit:{' '}
              <Link
                to={omcAnnouncementPopup?.url}
                target="_blank"
                className="font-bold"
              >
                {omcAnnouncementPopup?.url}
              </Link>
            </p>
          )}
          <div className="flex justify-end mt-10">
            <Button btnType="dark" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      }
    />
  );
}
