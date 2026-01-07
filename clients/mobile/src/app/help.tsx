import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I book an advertising space?',
    answer: 'Browse available spaces in the Discover tab, select a space you like, choose your dates, and submit a booking request. The space owner will review and approve your request.',
  },
  {
    question: 'How do payments work?',
    answer: 'Payment is held securely until the space owner confirms your ad installation. After verification, the payment is released to the owner minus our service fee.',
  },
  {
    question: 'What if my ad isn\'t installed correctly?',
    answer: 'If there\'s an issue with your installation, you can open a dispute within 24 hours of the verification photo being submitted. Our team will review and resolve the issue.',
  },
  {
    question: 'How do I list my space?',
    answer: 'Switch to Owner mode using the menu, then go to Listings and tap the + button to add a new space. Fill in the details, upload photos, and set your pricing.',
  },
  {
    question: 'When do I get paid as a space owner?',
    answer: 'Payouts are processed after the advertiser approves the installation verification (or after 48 hours auto-approval). Funds typically arrive in 2-3 business days.',
  },
];

export default function Help() {
  const { theme } = useTheme();

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@elaview.com');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://elaview.com/help');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Help Center',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="help-buoy-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            How can we help?
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Find answers to common questions or reach out to our support team.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleContactSupport}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Contact Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card }]}
            onPress={handleVisitWebsite}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.success}15` }]}>
              <Ionicons name="globe-outline" size={24} color={colors.success} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Help Website
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>
        <Card style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View
              key={index}
              style={[
                styles.faqItem,
                index < faqs.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.faqQuestion, { color: theme.text }]}>
                {faq.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                {faq.answer}
              </Text>
            </View>
          ))}
        </Card>

        {/* Additional Resources */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          RESOURCES
        </Text>
        <Card style={styles.resourcesContainer}>
          <ListItem
            title="Terms of Service"
            leftIcon="document-text-outline"
            onPress={() => {}}
          />
          <ListItem
            title="Privacy Policy"
            leftIcon="shield-outline"
            onPress={() => {}}
          />
          <ListItem
            title="Community Guidelines"
            leftIcon="people-outline"
            onPress={() => {}}
            showBorder={false}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },
  faqContainer: {
    padding: 0,
  },
  faqItem: {
    padding: spacing.md,
  },
  faqQuestion: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  faqAnswer: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  resourcesContainer: {
    padding: 0,
  },
});
