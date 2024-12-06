import React from 'react';
import { Avatar } from '@mui/material';

const AvatarComponent = ({ src, alt = 'Avatar', size = 64 }) => {
  return (
    <Avatar
      src={src}
      alt={alt}
      sx={{ width: size, height: size }}
    />
  );
};

export default AvatarComponent;
