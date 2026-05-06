import { create } from 'zustand';

export const useModalStore = create(set => ({
    isOpenModal: false,
    markerData: null,

    openModal: data => {
        set({ isOpenModal: true, markerData: data });
    },

    closeModal: () => {
        set({ isOpenModal: false, markerData: null });
    },
}));

export const useModalCarouselStore = create(set => ({
    isModalCarouselOpen: false,
    imageData: null,

    openCarouselModal: data => {
        set({ isModalCarouselOpen: true, imageData: data });
    },
    closeCarouselModal: () => {
        set({ isModalCarouselOpen: false, imageData: null });
    },
}));

export const useEventModalStore = create(set => ({
    isEventModalOpen: false,
    eventData: null,

    openEventModal: data => {
        set({ isEventModalOpen: true, eventData: data });
    },
    closeEventModal: () => {
        set({ isEventModalOpen: false, eventData: null });
    },
}));

export const useSpotDetailModalStore = create(set => ({
    isOpen: false,
    spotId: null,
    spotSlug: null,
    openSpotModal: (spotId, spotSlug = null) => set({ isOpen: true, spotId, spotSlug }),
    closeSpotModal: () => set({ isOpen: false, spotId: null, spotSlug: null }),
}));
