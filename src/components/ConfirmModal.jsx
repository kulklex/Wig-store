import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            className="modal d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content border-0 shadow-sm rounded-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-body text-center text-black p-4">
                  <h5 className="mb-3">{title}</h5>
                  <p className="text-muted small mb-4">{message}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-dark px-4"
                      onClick={onCancel}
                    >
                      {cancelText}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-${confirmVariant} px-4`}
                      onClick={onConfirm}
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
