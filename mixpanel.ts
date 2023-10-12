import {Mixpanel} from 'mixpanel-react-native';


const MIXPANEL_DEV = 'e49bb3d007d919e301bc925750b0e32d'

const trackAutomaticEvents = true;
export const mixpanel = new Mixpanel(MIXPANEL_DEV, trackAutomaticEvents);
mixpanel.init();

export const mixpanel_token = MIXPANEL_DEV;
