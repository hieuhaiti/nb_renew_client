import { create } from 'zustand';

export const useCategoriesStore = create(set => ({
    categoriesStoreID: null,
    categoriesStoreName: null,
    setCategory: categories =>
        set({
            categoriesStoreID: categories.id,
            categoriesStoreName: categories.name,
        }),

    setCategoryID: id =>
        set({
            categoriesStoreID: id,
        }),
}));
