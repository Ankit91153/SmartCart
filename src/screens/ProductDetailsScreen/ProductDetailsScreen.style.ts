import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.surface,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: colors.background,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },

  wishlistFab: {
    position: 'absolute',
    top: 260,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  infoContainer: {
    padding: 16,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  brand: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 28,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },

  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  stockInStock: { backgroundColor: colors.successLight },
  stockLow: { backgroundColor: colors.warningLight },
  stockOut: { backgroundColor: colors.errorLight },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockTextIn: { color: colors.success },
  stockTextLow: { color: colors.warning },
  stockTextOut: { color: '#DC2626' },

  divider: {
    height: 1,
    backgroundColor: colors.cardBg,
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 22,
    marginBottom: 16,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCardIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoCardLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  reviewCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBg,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  reviewStars: {
    fontSize: 12,
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 18,
  },

  similarContainer: {
    padding: 16,
    paddingTop: 0,
  },
  similarScroll: {
    marginTop: 8,
  },
  similarCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.cardBg,
  },
  similarImage: {
    width: 140,
    height: 110,
    backgroundColor: colors.background,
  },
  similarInfo: {
    padding: 8,
  },
  similarTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  similarPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },

  bottomStepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    height: 50,
    paddingHorizontal: 16,
  },
  bottomStepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomStepperBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomStepperText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.blueDark,
  },
});
