'use client';

import { useState, useEffect } from 'react';

const IMAGES_MAP: Record<string, string[]> = {
  about: [
    '/assets/about/andreea-v-Hm_d7cIs7K8-unsplash.jpg',
    '/assets/about/declan-sun-VAqZ_VNr7ww-unsplash.jpg',
    '/assets/about/lighten-up-DcFJuWICOSY-unsplash.jpg',
    '/assets/about/nhn-1OYWEEoPPzE-unsplash.jpg',
    '/assets/about/rumman-amin-FBJgPN9Di7Y-unsplash.jpg',
    '/assets/about/tanya-barrow-acY_TytcmgY-unsplash.jpg',
    '/assets/about/zachy-beider-qdY03iKRbXA-unsplash.jpg'
  ],
  contact: [
    '/assets/contact/firmbee-com-SpVHcbuKi6E-unsplash.jpg',
    '/assets/contact/nordwood-themes-q8U1YgBaRQk-unsplash.jpg',
    '/assets/contact/volodymyr-hryshchenko-V5vqWC9gyEU-unsplash.jpg'
  ],
  faq: [
    '/assets/faq/emily-morter-8xAA0f9yQnE-unsplash.jpg',
    '/assets/faq/laurin-steffens-IVGZ6NsmyBI-unsplash.jpg',
    '/assets/faq/towfiqu-barbhuiya-oZuBNC-6E2s-unsplash.jpg',
    '/assets/faq/wesley-tingey-FIq7K_wD4jM-unsplash.jpg'
  ],
  home: [
    '/assets/home/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
    '/assets/home/jimmy-funkhouser-ZmxZioEdeaU-unsplash (1).jpg',
    '/assets/home/jimmy-funkhouser-ZmxZioEdeaU-unsplash.jpg',
    '/assets/home/kaylin-pacheco-5ToyvEJIny8-unsplash.jpg',
    '/assets/home/tamas-pap-N7lIJLtAegc-unsplash.jpg'
  ],
  shop: [
    '/assets/shop/anya-richter-Rtxpbrf6mpw-unsplash.jpg',
    '/assets/shop/ashim-d-silva-ZmgJiztRHXE-unsplash.jpg',
    '/assets/shop/elliot-zoz-NoxwkSkOdCY-unsplash.jpg',
    '/assets/shop/keagan-henman-Won79_9oUEk-unsplash.jpg',
    '/assets/shop/markus-spiske-TXvCcWl3nEI-unsplash.jpg',
    '/assets/shop/richard-wang-u-TTWZLH1aU-unsplash.jpg'
  ]
};

export function useRandomImage(category: string): string {
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    const list = IMAGES_MAP[category];
    if (list && list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      setImage(list[randomIndex]);
    }
  }, [category]);

  return image;
}
