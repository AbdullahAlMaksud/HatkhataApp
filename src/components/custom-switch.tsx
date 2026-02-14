import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  size = 24,
  activeColor,
  inactiveColor,
  thumbColor = '#FFFFFF',
}) => {
  const { theme } = useUnistyles();
  
  // Dimensions
  const trackWidth = size * 1.8;
  const trackHeight = size;
  const thumbSize = size - 4;
  const padding = 2;

  // Animations
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 0.8,
      damping: 12,
      stiffness: 100,
      overshootClamping: false,
    });
  }, [value, progress]);

  // Derived colors
  const activeTrackColor = activeColor || theme.colors.primary;
  const inactiveTrackColor = inactiveColor || theme.colors.border;

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveTrackColor, activeTrackColor]
    );

    return {
      backgroundColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = (trackWidth - thumbSize - padding * 2) * progress.value;

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => ({
        width: trackWidth,
        height: trackHeight,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            padding: padding,
          },
          trackAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbColor,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2,
  },
});

export default CustomSwitch;
