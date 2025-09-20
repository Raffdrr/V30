import React, { useEffect, useRef } from 'react';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  customClasses?: string;
