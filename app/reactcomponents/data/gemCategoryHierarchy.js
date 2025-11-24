'use client';

const unique = (items = []) => Array.from(new Set(items.filter(Boolean)));

export const gemCategoryHierarchy = [
    {
        category: 'Ruby',
        subcategories: [
            'Burma Ruby',
            'African Ruby',
            'Mozambique Ruby',
            'Pigeon Blood Ruby',
            'Thailand Ruby',
            'Other Ruby'
        ]
    },
    {
        category: 'Sapphire',
        subcategories: [
            'Blue Sapphire (Neelam)',
            'Yellow Sapphire (Pukhraj)',
            'Kashmir Sapphire',
            'Cornflower Blue Sapphire',
            'Padparadscha Sapphire',
            'Pitambari (Bi-Colour) Sapphire',
            'Other Sapphire'
        ]
    },
    {
        category: 'Emerald',
        subcategories: [
            'Colombian Emerald',
            'Zambian Emerald',
            'Panjshir Emerald',
            'Swat Emerald',
            'No-Oil Emerald',
            'Other Emerald'
        ]
    },
    {
        category: 'Diamond',
        subcategories: [
            'Colorless Diamond',
            'Yellow Diamond',
            'Fancy Color Diamond',
            'Polki Diamond',
            'Rose Cut Diamond',
            'Other Diamond'
        ]
    },
    {
        category: 'Pearl',
        subcategories: [
            'Basra Pearl',
            'South Sea Pearl',
            'Freshwater Pearl',
            'Cultured Pearl',
            'Keshi Pearl',
            'Other Pearl'
        ]
    },
    {
        category: 'Coral',
        subcategories: [
            'Italian Red Coral',
            'Japanese Red Coral',
            'Ox Blood Coral',
            'White Coral',
            'Moonga (Red Coral)',
            'Other Coral'
        ]
    },
    {
        category: 'Topaz & Quartz',
        subcategories: [
            'Blue Topaz',
            'Imperial Topaz',
            'Citrine (Sunela)',
            'Amethyst',
            'Smoky Quartz',
            'Other Topaz/Quartz'
        ]
    },
    {
        category: 'Opal & Exotic',
        subcategories: [
            'Australian Opal',
            'Ethiopian Opal',
            'Fire Opal',
            'Black Opal',
            'Tanzanite',
            'Other Exotic Gem'
        ]
    },
    {
        category: 'Cat\'s Eye & Hessonite',
        subcategories: [
            'Cat\'s Eye (Lehsunia)',
            'Chrysoberyl Cat\'s Eye',
            'Gomed (Hessonite)',
            'Cinnamon Stone',
            'Rahu Stone',
            'Other Cat\'s Eye/Hessonite'
        ]
    },
    {
        category: 'Custom',
        subcategories: [
            'Custom'
        ]
    }
];

export const getCategoryOptions = () => unique(gemCategoryHierarchy.map(item => item.category));

export const getSubcategoryOptions = (category) => {
    const entry = gemCategoryHierarchy.find(item => item.category === category);
    if (entry) {
        return unique(entry.subcategories);
    }
    return unique(gemCategoryHierarchy.flatMap(item => item.subcategories));
};

export const getAllSubcategories = () => unique(
    gemCategoryHierarchy.flatMap(item => item.subcategories)
);

