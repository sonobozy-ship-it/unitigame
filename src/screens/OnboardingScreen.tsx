import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Linking, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EULA_KEY = 'koru_eula_accepted';

export async function isEulaAccepted(): Promise<boolean> {
  const v = await AsyncStorage.getItem(EULA_KEY);
  return v === '1';
}

interface Props {
  onAccept: () => void;
}

export default function OnboardingScreen({ onAccept }: Props) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);
    await AsyncStorage.setItem(EULA_KEY, '1');
    onAccept();
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isBottom) setScrolledToBottom(true);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />

      {/* Logo */}
      <View style={s.logoRow}>
        <Text style={s.logo}>KORU</Text>
        <Text style={s.logoSub}>Find your flow.</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Before you play</Text>
        <Text style={s.cardSub}>Please read and agree to continue</Text>

        <ScrollView
          style={s.scroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
        >
          <Text style={s.sectionHead}>Terms of Service</Text>
          <Text style={s.body}>
            By downloading, installing or using KORU ("the App"), you agree to be bound by these Terms of Service. If you do not agree, do not use the App.{'\n\n'}
            <Text style={s.bold}>1. License</Text>{'\n'}
            We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes.{'\n\n'}
            <Text style={s.bold}>2. In-App Purchases</Text>{'\n'}
            The App contains optional in-app purchases (coins, hint packs). All purchases are final and non-refundable unless required by applicable law. Prices may change at any time.{'\n\n'}
            <Text style={s.bold}>3. Advertising</Text>{'\n'}
            The App may display advertisements from third-party networks. By using the App you consent to receive such advertisements. You may remove ads via the "Remove Ads" purchase.{'\n\n'}
            <Text style={s.bold}>4. User Conduct</Text>{'\n'}
            You agree not to reverse-engineer, modify, or distribute the App or its content. You agree not to exploit bugs or use third-party software to gain unfair advantage.{'\n\n'}
            <Text style={s.bold}>5. Disclaimer of Warranties</Text>{'\n'}
            The App is provided "as is" without warranty of any kind. We do not guarantee uninterrupted or error-free operation.{'\n\n'}
            <Text style={s.bold}>6. Limitation of Liability</Text>{'\n'}
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the App.{'\n\n'}
          </Text>

          <Text style={s.sectionHead}>Privacy Policy</Text>
          <Text style={s.body}>
            <Text style={s.bold}>What we collect</Text>{'\n'}
            We collect minimal data required for the App to function: game progress (stored locally on your device), and anonymous analytics (device model, OS version, session duration) to improve the game.{'\n\n'}
            <Text style={s.bold}>Advertising data</Text>{'\n'}
            Third-party ad networks (e.g. Google AdMob) may collect advertising identifiers and usage data in accordance with their own privacy policies. You can opt out of personalised ads in your device settings.{'\n\n'}
            <Text style={s.bold}>Children</Text>{'\n'}
            The App is intended for users aged 4 and older. We do not knowingly collect personal information from children under 13.{'\n\n'}
            <Text style={s.bold}>Data storage</Text>{'\n'}
            Game progress is stored locally on your device via AsyncStorage and is not transmitted to our servers.{'\n\n'}
            <Text style={s.bold}>Contact</Text>{'\n'}
            For questions about privacy, contact: privacy@koruflow.app{'\n\n'}
            <Text style={s.bold}>Updates</Text>{'\n'}
            We may update this policy at any time. Continued use of the App constitutes acceptance of the updated policy.{'\n\n'}
          </Text>

          <Text style={s.sectionHead}>Data Consent (GDPR)</Text>
          <Text style={s.body}>
            If you are located in the European Economic Area, you have the right to access, correct, or delete your personal data. Since we store data only on your device, you may clear all data by uninstalling the App.{'\n\n'}
            By tapping "Agree & Play" you confirm you have read and agree to the Terms of Service and Privacy Policy above.
          </Text>
        </ScrollView>

        {!scrolledToBottom && (
          <Text style={s.scrollHint}>↓ Scroll down to continue</Text>
        )}

        <View style={s.links}>
          <TouchableOpacity onPress={() => Linking.openURL('https://koruflow.app/terms')}>
            <Text style={s.link}>Full Terms</Text>
          </TouchableOpacity>
          <Text style={s.linkDot}>·</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://koruflow.app/privacy')}>
            <Text style={s.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.acceptBtn, !scrolledToBottom && s.acceptBtnDisabled]}
          onPress={handleAccept}
          disabled={!scrolledToBottom}
          activeOpacity={0.8}
        >
          <Text style={s.acceptBtnText}>
            {scrolledToBottom ? '✓  Agree & Play' : 'Read to continue…'}
          </Text>
        </TouchableOpacity>

        <Text style={s.decline}>
          Tap "Agree & Play" to accept.{'\n'}Closing the app means you decline.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0A0A14' },
  logoRow:    { alignItems: 'center', paddingTop: 28, paddingBottom: 16 },
  logo:       { fontSize: 40, fontWeight: '900', color: '#3ECFB2', letterSpacing: 6 },
  logoSub:    { color: '#6B6B8A', fontSize: 14, marginTop: 4, letterSpacing: 2 },

  card:       { flex: 1, backgroundColor: '#13131F', margin: 16, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2a2a4a' },
  cardTitle:  { color: '#E8E6F0', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  cardSub:    { color: '#6B6B8A', fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 14 },

  scroll:     { flex: 1, marginBottom: 8 },
  sectionHead:{ color: '#3ECFB2', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 12, marginBottom: 6 },
  body:       { color: '#9898B0', fontSize: 12, lineHeight: 19 },
  bold:       { color: '#C0BED0', fontWeight: '700' },
  scrollHint: { color: '#6B6B8A', fontSize: 12, textAlign: 'center', paddingVertical: 6 },

  links:      { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14, marginTop: 4 },
  link:       { color: '#3ECFB2', fontSize: 12 },
  linkDot:    { color: '#6B6B8A', fontSize: 12 },

  acceptBtn:         { backgroundColor: '#3ECFB2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  acceptBtnDisabled: { backgroundColor: '#1a3a34', opacity: 0.6 },
  acceptBtnText:     { color: '#0A0A14', fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
  decline:           { color: '#6B6B8A', fontSize: 11, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
