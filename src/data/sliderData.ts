import { ImageSourcePropType } from 'react-native';

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  description: string;
};

export const sliderData: ImageSliderType[] = [
  {
    title: "PM-KISAN Scheme",
    image: require('../../assets/images/pm-kisan.jpg'),
    description: "Direct income support of ₹6000 per year to small and marginal farmers across India"
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana",
    image: require('../../assets/images/crop-insurance.jpg'),
    description: "Comprehensive crop insurance scheme providing financial support against crop loss"
  },
  {
    title: "Kisan Credit Card",
    image: require('../../assets/images/kcc.jpg'),
    description: "Easy credit access for farmers to meet their agricultural and consumption needs"
  },
  {
    title: "Soil Health Card Scheme",
    image: require('../../assets/images/soil-health.jpg'),
    description: "Promotes soil test based nutrient management for improving soil fertility"
  },
  {
    title: "PM Kisan Maandhan Yojana",
    image: require('../../assets/images/pension.jpg'),
    description: "Pension scheme ensuring social security for small and marginal farmers"
  }
];