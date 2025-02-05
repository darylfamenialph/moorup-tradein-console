import { faGrip } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProps, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Column } from '../../constants';
import { AppButton } from '../button';
import { Checkbox } from '../checkbox';
import { FormGroup, FormWrapper } from '../form';
import { StyledIcon } from '../styled';
import { withChild } from '../with-child';

const Container = styled.div`
  width: 100%;
`;

const ColumnItem = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: ${({ isDragging }) => (isDragging ? '#f3f3f3' : '#fff')};
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DroppableContainer = styled.div``;

type Props = {
  storageKey: string;
  defaultColumns: Column[];
  onSave: (columns: Column[]) => void;
};

const WCDroppable = withChild(Droppable);
const WCDroppableContainer = withChild(DroppableContainer);

export const StrictModeDroppable = ({ children, ...props }: DroppableProps & {
  children: (provided: DroppableProvided) => React.ReactNode
}) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <WCDroppable {...props}>{children}</WCDroppable>;
};

const WCStrictModeDroppable = withChild(StrictModeDroppable);
const WCColumnItem = withChild(ColumnItem);
const WCItem = withChild(Item);
const WCDragDropContext = withChild(DragDropContext);
const WCDraggable = withChild(Draggable);

export function CustomizeColumns({ storageKey, defaultColumns, onSave }: Props) {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [disableSaving, setDisableSaving] = useState<boolean>(false);
  const [disableSavingErrorMessage, setDisableSavingErrorMessage] = useState<string>('')

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columns);
    const [removed] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, removed);

    const updatedColumns = reorderedColumns.map((column, index) => ({
      ...column,
      order: index + 1,
    }));

    setColumns(updatedColumns);
  };

  const toggleColumn = (keyName: string) => {
    const updatedColumns = columns.map((column) =>
      column.keyName === keyName ? { ...column, hidden: !column.hidden } : column
    );

    const visibleColumns = updatedColumns.filter((column) => !column.hidden);
    const visibleCount = visibleColumns.length;

    if (visibleCount < 3) {
      setDisableSavingErrorMessage('At least 3 columns must be visible.');
      setDisableSaving(true);
    } else {
      setDisableSavingErrorMessage('');
      setDisableSaving(false);
    }

    setColumns(updatedColumns);
  };

  const saveConfiguration = () => {
    const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
    customizedColumns[storageKey] = columns;
    localStorage.setItem('CC', JSON.stringify(customizedColumns));
    onSave(columns);
  };

  const resetConfiguration = () => {
    const resetColumns = defaultColumns.map((column, index) => ({
      ...column,
      order: index + 1,
    }));

    setColumns(resetColumns);
    setDisableSavingErrorMessage('');
    setDisableSaving(false);
  };

  const draggableColumns = columns.filter((column) => column.label !== 'Actions');
  const actionsColumn = columns.find((column) => column.label === 'Actions');

  return (
    <FormWrapper
      formTitle="Customize Columns"
      subtTitle="Drag to reorder columns and check to show or hide."
    >
      <Container>
        <WCDragDropContext onDragEnd={handleDragEnd}>
          <WCStrictModeDroppable droppableId="columns">
            {(provided: DroppableProvided) => (
              <WCDroppableContainer {...provided.droppableProps} ref={provided.innerRef}>
                {draggableColumns.map((column, index) => (
                  <WCDraggable key={index} draggableId={index.toString()} index={index}>
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <WCColumnItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <WCItem>
                          <Checkbox
                            label={column.label}
                            checked={!column.hidden}
                            onChange={() => toggleColumn(column.keyName)}
                          />
                          <StyledIcon icon={faGrip} color="#9e9e9e" hovercolor="#ccc" />
                        </WCItem>
                      </WCColumnItem>
                    )}
                  </WCDraggable>
                ))}
                {provided.placeholder}
              </WCDroppableContainer>
            )}
          </WCStrictModeDroppable>
        </WCDragDropContext>
        {actionsColumn && (
          <WCColumnItem isDragging={false}>
            <Checkbox
              label={actionsColumn.label}
              checked={!actionsColumn.hidden}
              onChange={() => toggleColumn(actionsColumn.keyName)}
              disabled
            />
          </WCColumnItem>
        )}

        <FormGroup>
          {disableSavingErrorMessage && <span style={{ color: 'red' }}>{disableSavingErrorMessage}</span>}
        </FormGroup>

        <FormGroup>
          <span />
          <FormGroup>
            <AppButton
              type="button"
              variant="outlined"
              width="100%"
              onClick={resetConfiguration}
            >
              Reset
            </AppButton>
            <AppButton
              type="button"
              width="100%"
              disabled={disableSaving}
              onClick={saveConfiguration}
            >
              Save
            </AppButton>
          </FormGroup>
        </FormGroup>
      </Container>
    </FormWrapper>
  );
}
