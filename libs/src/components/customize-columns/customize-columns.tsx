/* eslint-disable @typescript-eslint/no-explicit-any */
import { faGrip } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Column } from '../../constants';
import { AppButton } from '../button';
import { Checkbox } from '../checkbox';
import { FormGroup } from '../form';
import { StyledIcon } from '../styled';

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

type Props = {
  storageKey: string;
  defaultColumns: Column[];
  onSave: (columns: Column[]) => void;
};

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
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
  return <Droppable {...props}>{children}</Droppable>;
};

export function CustomizeColumns({ storageKey, defaultColumns, onSave }: Props) {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [disableSaving, setDisableSaving] = useState<boolean>(false);
  const [disableSavingErrorMessage, setDisableSavingErrorMessage] = useState<string>('')

  const handleDragEnd = (result: any) => {
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
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="columns">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {draggableColumns.map((column, index) => (
                <Draggable key={column.keyName} draggableId={column.keyName || column.label} index={index}>
                  {(provided, snapshot) => (
                    <ColumnItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                    >
                      <Item>
                        <Checkbox
                          label={column.label}
                          checked={!column.hidden}
                          onChange={() => toggleColumn(column.keyName)}
                        />
                        <StyledIcon icon={faGrip} color="#9e9e9e" hovercolor="#ccc" />
                      </Item>
                    </ColumnItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      {actionsColumn && (
        <ColumnItem isDragging={false}>
          <Checkbox
            label={actionsColumn.label}
            checked={!actionsColumn.hidden}
            onChange={() => toggleColumn(actionsColumn.keyName)}
            disabled
          />
        </ColumnItem>
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
  );
}
