import { ButtonGroup, MODAL_TYPES, StyledInput } from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { ChangeEvent, useState } from 'react';

interface AddNoteProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string, value: string) => void;
}

interface NoteState {
  value: string;
  error: boolean;
  errorMessage: string;
}

const initialState: NoteState = {
  value: '',
  error: false,
  errorMessage: '',
};

export function AddNote({ setModalStatus, onSubmit }: AddNoteProps) {
  const [noteState, setNoteState] = useState<NoteState>(initialState);

  const resetForm = () => setNoteState(initialState);

  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.ADD_NOTE, noteState.value);
    setModalStatus(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNoteState({
      value: e.target.value,
      error: false,
      errorMessage: '',
    });
  };

  const handleBlur = () => {
    const trimmedValue = noteState.value.trim();
    setNoteState((prev) => ({
      ...prev,
      error: !trimmedValue,
      errorMessage: !trimmedValue ? 'This field is required.' : '',
    }));
  };

  const handleCloseModal = () => {
    resetForm();
    setModalStatus(false);
  };

  return (
    <>
      <StyledInput
        label="Note"
        type="text"
        placeholder="Enter note"
        error={noteState.error}
        errorMessage={noteState.errorMessage}
        name="note"
        enableHoverImage={false}
        value={noteState.value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <ButtonGroup
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        submitDisabled={isEmpty(noteState.value)}
      />
    </>
  );
}
