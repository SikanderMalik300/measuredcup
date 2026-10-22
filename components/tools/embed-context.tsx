'use client';

import { createContext, useContext } from 'react';

// True when a tool is rendered inside an /embed/ iframe: hide Share/Print, skip localStorage and analytics.
export const EmbedContext = createContext(false);
export const useEmbed = () => useContext(EmbedContext);
