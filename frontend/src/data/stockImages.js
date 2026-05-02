const STOCK_IMAGE_MAP = [
  {
    test: /ferrari|275 gtb|sf90/i,
    url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80',
  },
  {
    test: /porsche|911 rsr|993/i,
    url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  },
  {
    test: /dino|ferrari 246|italian classics/i,
    url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
  {
    test: /skyline|r34|jdm/i,
    url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
  },
  {
    test: /rs3|audi/i,
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    test: /track|ev|build/i,
    url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
];

export function getStockImage(title = '', category = '') {
  const text = `${title} ${category}`.trim();
  const entry = STOCK_IMAGE_MAP.find((item) => item.test.test(text));
  return entry?.url || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80';
}
