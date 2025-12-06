import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

const UsageHeatMap = ({ data }) => {
  // data should be an array of 24 values (one for each hour)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  if (!data || data.length === 0) {
    return (
      <Card style={styles.container}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  const maxValue = Math.max(...data, 1);
  
  const getIntensity = (value) => {
    if (value === 0) return 0;
    const ratio = value / maxValue;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  const getColor = (intensity) => {
    switch (intensity) {
      case 0:
        return colors.surface;
      case 1:
        return colors.success + '30';
      case 2:
        return colors.warning + '50';
      case 3:
        return colors.warning + '80';
      case 4:
        return colors.danger;
      default:
        return colors.surface;
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Hourly Usage Heatmap</Text>
      <View style={styles.grid}>
        {hours.map((hour) => {
          const value = data[hour] || 0;
          const intensity = getIntensity(value);
          return (
            <View key={hour} style={styles.cellContainer}>
              <TouchableOpacity
                style={[
                  styles.cell,
                  { backgroundColor: getColor(intensity) },
                ]}
              >
                <Text style={styles.cellValue}>{value}</Text>
              </TouchableOpacity>
              <Text style={styles.cellLabel}>
                {hour.toString().padStart(2, '0')}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.surface }]} />
          <Text style={styles.legendText}>None</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: getColor(1) }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: getColor(2) }]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: getColor(3) }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: getColor(4) }]} />
          <Text style={styles.legendText}>Very High</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cellContainer: {
    width: '12%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cellValue: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cellLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});

export default UsageHeatMap;

