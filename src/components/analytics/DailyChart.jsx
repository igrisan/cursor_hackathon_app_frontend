import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { formatDate } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

const DailyChart = ({ data }) => {
  if (!data || !data.length) {
    return (
      <Card style={styles.container} variant="outlined">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-line" size={32} color={colors.neutralLight} />
          <Text style={styles.emptyText}>No data available yet</Text>
        </View>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.totalPuffs || 0), 1);
  const chartWidth = screenWidth - spacing.lg * 2 - spacing.lg * 2;
  const barWidth = Math.floor((chartWidth - spacing.xs * (data.length - 1)) / data.length);

  return (
    <Card style={styles.container} variant="elevated">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Usage Trend</Text>
          <Text style={styles.subtitle}>Last 7 days</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Puffs</Text>
        </View>
      </View>

      {/* Custom Bar Chart */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>{maxValue}</Text>
          <Text style={styles.yAxisLabel}>{Math.round(maxValue / 2)}</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          {/* Bar chart */}
          <View style={styles.bars}>
            {data.map((item, index) => {
              const height = ((item.totalPuffs || 0) / maxValue) * 140;
              const isToday = index === data.length - 1;
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(height, 4),
                          backgroundColor: isToday ? colors.primary : colors.primary + '60',
                        },
                      ]}
                    >
                      {item.totalPuffs > 0 && (
                        <Text style={styles.barValue}>{item.totalPuffs}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.barLabel, isToday && styles.barLabelActive]}>
                    {formatDate(item.date, 'ddd')}
                  </Text>
                </View>
              );
            })}
          </View>
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
  chartContainer: {
    flexDirection: 'row',
    height: 180,
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  yAxisLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.muted,
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: colors.border,
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 24,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    position: 'absolute',
    top: -18,
  },
  barLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  barLabelActive: {
    color: colors.primary,
    fontWeight: '600',
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

export default DailyChart;
