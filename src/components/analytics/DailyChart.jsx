import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Card from '../common/Card';
import { colors, spacing, typography } from '../../utils/theme';
import { formatDate } from '../../utils/helpers';

const screenWidth = Dimensions.get('window').width;

const DailyChart = ({ data }) => {
  if (!data || !data.length) {
    return (
      <Card style={styles.container}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((item) => formatDate(item.date, 'MMM DD')),
    datasets: [
      {
        data: data.map((item) => item.totalPuffs || 0),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Daily Usage Trend</Text>
      <LineChart
        data={chartData}
        width={screenWidth - spacing.lg * 4}
        height={220}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />
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
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});

export default DailyChart;

