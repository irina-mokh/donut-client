import styles from './donut.module.scss';

import { ICategory } from '../../interfaces/category';
import { IAction } from '../../interfaces/action';

import Link from 'next/link';
import { useState, useRef, MutableRefObject, useEffect } from 'react';
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';

import { AppThunkDispatch } from '../../store';
import { deleteCategory } from '../../store/main/action';

import { Action } from '../action';
import { Modal } from '../modal';
import { splitByDigits } from '../../utils';
import { ConfirmDialog } from '../confirmDialog';
import { DragLayer } from '../dragLayer';

export const Donut = (props: ICategory) => {
  const { name, id, type, total, start } = props;

  const [newAction, setNewAction] = useState<IAction>({
    from: 1,
    to: 1,
    sum: '',
    date: new Date().toISOString().split('T')[0],
  });
  const dispatch: AppThunkDispatch = useDispatch();

  // action creation modal
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const [showDialog, setShowDialog] = useState(false);

  //border by category type
  let border = 'transparent';
  switch (type) {
    case 'income':
      border = 'border-slate-400';
      break;
    case 'asset':
      border = 'border-teal-500';
      break;
    case 'expense':
      border = 'border-yellow-300';
      break;
  }

  const handleDeleteCategory = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(deleteCategory(id));
  };

  // drag and drop
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);

  // Drag donut
  const [{ opacity, isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'donut',
      item: props,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 'opacity-0' : 'opacity-100',
      }),
    }),
    [props]
  );

  useEffect(() => {
    preview(getEmptyImage());
  }, []);
  // Drop donut
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'donut',
      drop: async (drag: ICategory) => {
        if (drag.type == 'expense' || type === 'income' || drag.id === id) {
          return;
        }
        setNewAction((state) => ({
          ...state,
          from: drag.id,
          to: id,
        }));
        setShowModal(true);
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [props]
  );

  // outline for drop area
  const isActive = canDrop && isOver;
  let outline = 'outline-transparent';
  if (isActive) {
    outline = 'outline-lime-500';
  } else if (canDrop) {
    outline = 'outline-slate-500';
  }

  drag(drop(ref));

  return (
    <>
      <Link href={`/category/${id}`}>
        <div className={`${styles.wrapper} ${border} ${outline} ${opacity}`} ref={ref}>
          <p className={styles.name}>{name}</p>
          <p className={styles.total}>{splitByDigits(total ? total : start)}</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowDialog(true);
            }}
            className={`${styles.delete} close-btn`}
          >
            🗙
          </button>
          {showDialog && (
            <ConfirmDialog
              confirmText={`Delete category ${name.toUpperCase()}?`}
              setOpen={setShowDialog}
              onConfirm={handleDeleteCategory}
            />
          )}
        </div>
      </Link>
      <DragLayer {...props} isDragging={isDragging} />
      {showModal ? (
        <Modal close={closeModal} title={`New transaction`}>
          <Action data={newAction} close={closeModal} onSave="create" />
        </Modal>
      ) : null}
    </>
  );
};
