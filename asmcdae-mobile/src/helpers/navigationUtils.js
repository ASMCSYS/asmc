import {Platform, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Hook to detect navigation type and get appropriate safe area insets
 * @returns {Object} Navigation configuration with safe area insets
 */
export const useNavigationConfig = () => {
  const insets = useSafeAreaInsets();
  const {height: screenHeight} = Dimensions.get('screen');
  const {height: windowHeight} = Dimensions.get('window');

  // Detect if device has gesture navigation or 3-button navigation
  const hasGestureNavigation = Platform.OS === 'android' && insets.bottom === 0;
  const hasThreeButtonNavigation =
    Platform.OS === 'android' && insets.bottom > 0;

  // Calculate navigation bar height
  const navigationBarHeight = screenHeight - windowHeight;

  // Determine if we need extra padding for bottom navigation
  const needsBottomPadding =
    Platform.OS === 'android' &&
    (hasThreeButtonNavigation || navigationBarHeight > 0);

  return {
    insets,
    hasGestureNavigation,
    hasThreeButtonNavigation,
    navigationBarHeight,
    needsBottomPadding,
    bottomPadding: needsBottomPadding
      ? Math.max(insets.bottom, 16)
      : insets.bottom,
  };
};

/**
 * Get tab bar style with proper safe area handling
 * @param {Object} config - Navigation configuration from useNavigationConfig
 * @returns {Object} Tab bar style object
 */
export const getTabBarStyle = config => {
  const baseStyle = {
    height: 60,
    paddingBottom: config.needsBottomPadding ? config.bottomPadding : 8,
    paddingTop: 8,
  };

  // Add extra padding for devices with 3-button navigation
  if (config.hasThreeButtonNavigation) {
    baseStyle.paddingBottom = Math.max(config.bottomPadding, 20);
  }

  return baseStyle;
};

/**
 * Get safe area style for screens
 * @param {Object} config - Navigation configuration from useNavigationConfig
 * @returns {Object} Safe area style object
 */
export const getSafeAreaStyle = config => {
  return {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingBottom: config.needsBottomPadding ? config.bottomPadding : 0,
  };
};
