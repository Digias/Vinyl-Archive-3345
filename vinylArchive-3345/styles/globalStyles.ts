// globalStyles.ts
import { StyleSheet, TextStyle, Platform } from 'react-native';

export const Colors = {
  background: '#654236',
  cardBackground: '#B38A58',
  primary: '#CE8D66',
  success: '#28a745',
  danger: '#dc3545',
  textPrimary: '#FEFFEA',
  textSecondary: '#bbb',
  textTertiary: '#aaa',
  inputBackground: '#01161E',
};

export const PlatformSpecificStyles = StyleSheet.create({
  containerWithNavigationBar: {
    paddingBottom: Platform.select({
      android: 40, // Valore base per Android
      ios: 20,     // Valore per iOS
      default: 20  // Default per altri OS
    })
  }
});

interface TypoStyles {
  title: TextStyle;
  subtitle: TextStyle;
  cardTitle: TextStyle;
  cardSubtitle: TextStyle;
  cardDetail: TextStyle;
}

export const Typography: TypoStyles = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  cardDetail: {
    color: Colors.textTertiary,
    fontSize: 14,
    marginBottom: 2,
  },
};

export default StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  // Text Elements
  title: {
    ...Typography.title,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  loadingText: {
    color: Colors.textPrimary,
    marginTop: 10,
    fontSize: 16,
  },

  // Inputs
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    color: Colors.textPrimary,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  searchInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 20,
  },

  // Cards & List Items
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 30,
    padding: 15,
    marginVertical: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginVertical: 6,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  vinylInfo: {
    flex: 1,
  },
  vinylArtist: {
    ...Typography.cardTitle,
  },
  vinylSide: {
    ...Typography.cardDetail,
  },
  statusBadge: {
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    color: 'white',
    textAlign: 'center',
  },
  inJukebox: {
    backgroundColor: Colors.success,
  },
  notInJukebox: {
    backgroundColor: '#6c757d',
  },
  jukeboxBadge: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
  successButton: {
    backgroundColor: Colors.success,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonDangerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300',
    padding: 5,
    marginVertical: 1,
  },
  buttonSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: Colors.cardBackground,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imageText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 14,
  },
});