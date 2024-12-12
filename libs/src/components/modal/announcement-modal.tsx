import { Link } from 'react-router-dom';
import { GenericModal } from './generic-modal';
import { Button } from '../button';

interface AnnouncementModalProps {
  headerText?: string;
  context?: string;
  url?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  headerText,
  context = '',
  url,
}: AnnouncementModalProps) {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={headerText}
      content={
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: context,
            }}
          />
          {url && (
            <p className="mt-4">
              For more information, please visit:{' '}
              <Link to={url} target="_blank" className="font-bold">
                {url}
              </Link>
            </p>
          )}
          <div className="flex justify-end mt-10">
            <Button btnType="dark" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    />
  );
}
