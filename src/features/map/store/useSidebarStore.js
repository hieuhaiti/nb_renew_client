import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  isLeftExpanded: true,
  isSubSidebarOpen: true,

  toggleLeftExpanded: () =>
    set((state) => {
      const nextExpanded = !state.isLeftExpanded;

      return {
        isLeftExpanded: nextExpanded,
        // Keep layout compact: collapsing the left sidebar also closes sub sidebar.
        isSubSidebarOpen: nextExpanded ? state.isSubSidebarOpen : false,
      };
    }),

  setLeftExpanded: (isExpanded) =>
    set((state) => ({
      isLeftExpanded: isExpanded,
      isSubSidebarOpen: isExpanded ? state.isSubSidebarOpen : false,
    })),

  toggleSubSidebar: () =>
    set((state) => ({
      isSubSidebarOpen: state.isLeftExpanded ? !state.isSubSidebarOpen : false,
    })),

  setSubSidebarOpen: (isOpen) =>
    set((state) => ({
      isSubSidebarOpen: state.isLeftExpanded ? isOpen : false,
    })),
}));
