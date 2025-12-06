import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../../utils/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomModal = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  animationType = 'slide',
  transparent = true,
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {title && (
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                {typeof title === 'string' ? (
                  <View style={styles.titleTextContainer}>
                    <View style={styles.titleText}>{title}</View>
                  </View>
                ) : (
                  title
                )}
              </View>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flex: 1,
  },
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
});

export default CustomModal;

