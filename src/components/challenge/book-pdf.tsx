import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register Google Fonts for selectable text
Font.register({
  family: 'Playfair',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXBYf9lW4e5j5hNKe1_w.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXBYf9lWIe5j5hNKe1_w.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'DMSans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhTmH-.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwA_pxhTmH-.ttf', fontWeight: 600 },
  ],
});

interface BookData {
  title: string;
  subtitle: string;
  authorName: string;
  authorBio: string;
  dedication: string;
  acknowledgments: string;
  template: string;
  poems: Array<{
    dayNumber: number;
    title: string;
    content: string;
    wordCount: number;
  }>;
}

// Template color schemes
const TEMPLATE_COLORS: Record<string, { bg: string; text: string; accent: string; muted: string }> = {
  classic: { bg: '#FEF9EF', text: '#451A03', accent: '#B45309', muted: '#78716C' },
  modern: { bg: '#1F2937', text: '#F9FAFB', accent: '#818CF8', muted: '#9CA3AF' },
  minimalist: { bg: '#FFFFFF', text: '#1F2937', accent: '#6B7280', muted: '#9CA3AF' },
  botanical: { bg: '#ECFDF5', text: '#064E3B', accent: '#059669', muted: '#6B7280' },
  gradient: { bg: '#7C3AED', text: '#FFFFFF', accent: '#F0ABFC', muted: '#E9D5FF' },
};

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'DMSans',
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: {
    fontFamily: 'Playfair',
    fontSize: 36,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  coverDivider: {
    width: 60,
    height: 1,
    marginBottom: 24,
  },
  coverAuthor: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
  },
  titlePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
  },
  titlePageTitle: {
    fontFamily: 'Playfair',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
  },
  titlePageSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  titlePageAuthor: {
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
  },
  titlePagePublisher: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 60,
    opacity: 0.5,
  },
  dedicationPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
  },
  dedicationText: {
    fontFamily: 'Playfair',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 1.8,
  },
  tocTitle: {
    fontFamily: 'Playfair',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 30,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  tocItemTitle: {
    fontSize: 11,
  },
  tocItemDay: {
    fontSize: 9,
    opacity: 0.6,
  },
  poemHeader: {
    marginBottom: 24,
  },
  poemDayLabel: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.5,
  },
  poemTitle: {
    fontFamily: 'Playfair',
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  poemDivider: {
    width: 40,
    height: 1,
    marginTop: 12,
  },
  poemContent: {
    fontSize: 12,
    lineHeight: 1.9,
    marginTop: 20,
  },
  poemLine: {
    marginBottom: 4,
  },
  ackTitle: {
    fontFamily: 'Playfair',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
    textAlign: 'center',
  },
  ackText: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: 'center',
  },
  authorBioTitle: {
    fontFamily: 'Playfair',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    textAlign: 'center',
  },
  authorBioText: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    opacity: 0.4,
  },
});

export function BookDocument(data: BookData) {
  const colors = TEMPLATE_COLORS[data.template] || TEMPLATE_COLORS.classic;

  return (
    <Document
      title={data.title}
      author={data.authorName}
      subject={`${data.title} — A poetry collection`}
    >
      {/* Cover Page */}
      <Page
        size="A5"
        style={[styles.coverPage, { backgroundColor: colors.bg }]}
      >
        <Text style={[styles.coverTitle, { color: colors.text }]}>
          {data.title}
        </Text>
        {data.subtitle && (
          <Text style={[styles.coverSubtitle, { color: colors.text }]}>
            {data.subtitle}
          </Text>
        )}
        <View
          style={[styles.coverDivider, { backgroundColor: colors.accent }]}
        />
        <Text style={[styles.coverAuthor, { color: colors.text }]}>
          {data.authorName}
        </Text>
      </Page>

      {/* Title Page */}
      <Page size="A5" style={[styles.titlePage, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.titlePageTitle, { color: '#1F2937' }]}>
          {data.title}
        </Text>
        <Text style={[styles.titlePageSubtitle, { color: '#6B7280' }]}>
          {data.subtitle}
        </Text>
        <Text style={[styles.titlePageAuthor, { color: '#1F2937' }]}>
          {data.authorName}
        </Text>
        <Text style={[styles.titlePagePublisher, { color: '#9CA3AF' }]}>
          Published by BookLeaf Publishing
        </Text>
      </Page>

      {/* Dedication Page */}
      {data.dedication && (
        <Page
          size="A5"
          style={[styles.dedicationPage, { backgroundColor: '#FFFFFF' }]}
        >
          <Text style={[styles.dedicationText, { color: '#374151' }]}>
            {data.dedication}
          </Text>
        </Page>
      )}

      {/* Table of Contents */}
      <Page size="A5" style={[styles.page, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.tocTitle, { color: '#1F2937' }]}>Contents</Text>
        {data.poems.map((poem) => (
          <View
            key={poem.dayNumber}
            style={[styles.tocItem, { borderBottomColor: '#E5E7EB' }]}
          >
            <Text style={[styles.tocItemTitle, { color: '#1F2937' }]}>
              {poem.title}
            </Text>
            <Text style={[styles.tocItemDay, { color: '#9CA3AF' }]}>
              Day {poem.dayNumber}
            </Text>
          </View>
        ))}
      </Page>

      {/* Poem Pages */}
      {data.poems.map((poem) => (
        <Page
          key={poem.dayNumber}
          size="A5"
          style={[styles.page, { backgroundColor: '#FFFFFF' }]}
        >
          <View style={styles.poemHeader}>
            <Text style={[styles.poemDayLabel, { color: colors.accent }]}>
              Day {poem.dayNumber}
            </Text>
            <Text style={[styles.poemTitle, { color: '#1F2937' }]}>
              {poem.title}
            </Text>
            <View
              style={[styles.poemDivider, { backgroundColor: colors.accent }]}
            />
          </View>
          <View style={styles.poemContent}>
            {poem.content.split('\n').map((line, i) => (
              <Text key={i} style={[styles.poemLine, { color: '#374151' }]}>
                {line || ' '}
              </Text>
            ))}
          </View>
          <Text style={[styles.pageNumber, { color: '#9CA3AF' }]}>
            {poem.dayNumber + (data.dedication ? 3 : 2)}
          </Text>
        </Page>
      ))}

      {/* Acknowledgments */}
      {data.acknowledgments && (
        <Page size="A5" style={[styles.page, { backgroundColor: '#FFFFFF' }]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text style={[styles.ackTitle, { color: '#1F2937' }]}>
              Acknowledgments
            </Text>
            <Text style={[styles.ackText, { color: '#374151' }]}>
              {data.acknowledgments}
            </Text>
          </View>
        </Page>
      )}

      {/* About the Author */}
      {data.authorBio && (
        <Page size="A5" style={[styles.page, { backgroundColor: '#FFFFFF' }]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text style={[styles.authorBioTitle, { color: '#1F2937' }]}>
              About the Author
            </Text>
            <Text style={[styles.authorBioText, { color: '#374151' }]}>
              {data.authorBio}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
