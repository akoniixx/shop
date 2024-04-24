import { ViewStyle } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends React.ComponentProps<typeof SafeAreaView> {
  children: React.ReactNode;
  containerStyles?: ViewStyle;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}
export default function Container({
  children,
  containerStyles,
  edges = ['top', 'bottom', 'left', 'right'],
  ...props
}: Props) {
  return (
    <SafeAreaView {...props} style={containerStyles} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
Container.defaultProps = {
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
};
