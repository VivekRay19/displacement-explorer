'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CollectionItem } from '../data/types';
import { NumberFormatPreference } from '../formatting/numbers';

interface ResearchContextType {
  numberFormat: NumberFormatPreference;
  setNumberFormat: (format: NumberFormatPreference) => void;
  guideMode: boolean;
  setGuideMode: (enabled: boolean) => void;
  collection: CollectionItem[];
  addToCollection: (item: Omit<CollectionItem, 'id' | 'addedAt'>) => void;
  removeFromCollection: (id: string) => void;
  updateCollectionNote: (id: string, note: string) => void;
  clearCollection: () => void;
  activeTraceRecord: any | null;
  setActiveTraceRecord: (record: any | null) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [numberFormat, setNumberFormatState] = useState<NumberFormatPreference>('international');
  const [guideMode, setGuideModeState] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [activeTraceRecord, setActiveTraceRecord] = useState<any | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedFormat = localStorage.getItem('de_number_format') as NumberFormatPreference;
      if (storedFormat === 'indian' || storedFormat === 'international') {
        setNumberFormatState(storedFormat);
      }
      const storedGuide = localStorage.getItem('de_guide_mode');
      if (storedGuide !== null) {
        setGuideModeState(storedGuide === 'true');
      }
      const storedCollection = localStorage.getItem('de_collection');
      if (storedCollection) {
        setCollection(JSON.parse(storedCollection));
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, []);

  const setNumberFormat = (format: NumberFormatPreference) => {
    setNumberFormatState(format);
    try {
      localStorage.setItem('de_number_format', format);
    } catch (e) {}
  };

  const setGuideMode = (enabled: boolean) => {
    setGuideModeState(enabled);
    try {
      localStorage.setItem('de_guide_mode', String(enabled));
    } catch (e) {}
  };

  const addToCollection = (item: Omit<CollectionItem, 'id' | 'addedAt'>) => {
    const newItem: CollectionItem = {
      ...item,
      id: 'col-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      addedAt: new Date().toISOString()
    };
    const updated = [newItem, ...collection];
    setCollection(updated);
    try {
      localStorage.setItem('de_collection', JSON.stringify(updated));
    } catch (e) {}
  };

  const removeFromCollection = (id: string) => {
    const updated = collection.filter(c => c.id !== id);
    setCollection(updated);
    try {
      localStorage.setItem('de_collection', JSON.stringify(updated));
    } catch (e) {}
  };

  const updateCollectionNote = (id: string, note: string) => {
    const updated = collection.map(c => c.id === id ? { ...c, notes: note } : c);
    setCollection(updated);
    try {
      localStorage.setItem('de_collection', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearCollection = () => {
    setCollection([]);
    try {
      localStorage.removeItem('de_collection');
    } catch (e) {}
  };

  return (
    <ResearchContext.Provider
      value={{
        numberFormat,
        setNumberFormat,
        guideMode,
        setGuideMode,
        collection,
        addToCollection,
        removeFromCollection,
        updateCollectionNote,
        clearCollection,
        activeTraceRecord,
        setActiveTraceRecord
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
}
