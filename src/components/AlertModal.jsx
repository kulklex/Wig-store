import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = 'OK',
  cancelText = 'Cancel',
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
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            className="modal d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content border-0 shadow rounded-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header bg-white text-black border-0">
                  <h5 className="modal-title">{title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                  ></button>
                </div>
                <div className="modal-body text-black">
                  <p>{message}</p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
