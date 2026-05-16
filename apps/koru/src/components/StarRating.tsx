import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  stars: number;
  size?: number;
}

export default function StarRating({ stars, size = 24 }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map(i => (
        <Text key={i} style={[styles.star, { fontSize: size, color: i <= stars ? theme.starFilled : theme.starEmpty }]}>
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  star: { fontWeight: 'bold' },
});
