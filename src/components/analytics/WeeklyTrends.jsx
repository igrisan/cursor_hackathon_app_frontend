import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

const WeeklyTrends = ({ data, previousWeekTotal = 0 }) => {
  if (!data || !data.length) {
    return (
      <Card style={styles.container} variant="outlined">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-bar" size={32} color={colors.neutralLight} />
          <Text style={styles.emptyText}>No data available yet</Text>
        </View>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.totalPuffs || 0), 1);
  const currentWeekTotal = data.reduce((sum, d) => sum + (d.totalPuffs || 0), 0);
  const average = Math.round(currentWeekTotal / data.length);

  // Calculate trend percentage
  const trendPercentage = previousWeekTotal > 0 
    ? Math.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100)
    : 0;
  const trendIsPositive = trendPercentage <= 0; // Lower puffs is positive (good)

  return (
    <Card style={styles.container} variant="elevated">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Comparison</Text>
          <Text style={styles.subtitle}>Average: {average} puffs/day</Text>
        </View>
        <View style={[styles.trendBadge, { backgroundColor: trendIsPositive ? colors.success + '15' : colors.warning + '15' }]}>
          <MaterialCommunityIcons 
            name={trendIsPositive ? "trending-down" : "trending-up"} 
            size={14} 
            color={trendIsPositive ? colors.success : colors.warning} 
          />
          <Text style={[styles.trendText, { color: trendIsPositive ? colors.success : colors.warning }]}>
            {trendPercentage === 0 ? '0%' : `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`}
          </Text>
        </View>
      </View>

      {/* Horizontal Bar Chart */}
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const width = ((item.totalPuffs || 0) / maxValue) * 100;
          const isToday = item.isToday || false; // Use isToday flag from data
          const isAboveAverage = (item.totalPuffs || 0) > average;
          
          return (
            <View key={index} style={styles.barRow}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                {item.day}
              </Text>
              <View style={styles.barBackground}>
                {/* Average line */}
                <View 
                  style={[
                    styles.averageLine, 
                    { left: `${(average / maxValue) * 100}%` }
                  ]} 
                />
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.max(width, 2)}%`,
                      backgroundColor: isToday 
                        ? colors.primary 
                        : isAboveAverage 
                          ? colors.warning + '80' 
                          : colors.success + '80',
                    },
                  ]}
                />
              </View>
              <Text style={styles.valueLabel}>{item.totalPuffs || 0}</Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Below average</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Above average</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  trendText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
  },
  chartContainer: {
    gap: spacing.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    width: 36,
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  dayLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  barBackground: {
    flex: 1,
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  averageLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.neutral,
    zIndex: 1,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  valueLabel: {
    width: 32,
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'right',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});

export default WeeklyTrends;
