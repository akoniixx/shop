import images from '../assets/images';
import { useLocalization } from '../contexts/LocalizationContext';

export const useMappingCompany = () => {
  const { t } = useLocalization();
  const mappingName = (company: string) => {
    switch (company) {
      case 'ICPL':
        return t('company.icpl');
      case 'ICPF':
        return t('company.icpf');
      case 'ICPI':
        return t('company.icpi');
      default:
        return '';
    }
  };
  const mappingLogo = (company: string) => {
    switch (company) {
      case 'ICPL':
        return images.ICPL;
      case 'ICPF':
        return images.ICPF;
      case 'ICPI':
        return images.ICPI;
    }
  };
  return { mappingName, mappingLogo };
};
