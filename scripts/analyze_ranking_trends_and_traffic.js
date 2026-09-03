import { google } from 'googleapis';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const searchconsole = google.searchconsole({
  version: 'v1',
  auth
});

async function runAnalysis() {
  console.log('========================================================================');
  console.log('📉 COMPREHENSIVE GOOGLE SEARCH RANKING & TRAFFIC TREND ANALYSIS');
  console.log('========================================================================\n');

  const today = new Date();
  const endDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  const startDate = new Date(today.setDate(today.getDate() - 60)).toISOString().split('T')[0];

  // 1. Day-by-Day Trend (Last 60 Days)
  const dailyRes = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 100
    }
  });

  console.log('📅 DAILY TRAFFIC & POSITION SNAPSHOT (LAST 20 DAYS):');
  const dailyRows = (dailyRes.data.rows || []).slice(-20);
  dailyRows.forEach(r => {
    console.log(`   ${r.keys[0]} -> Impressions: ${r.impressions.toString().padStart(4, ' ')} | Clicks: ${r.clicks} | Avg Pos: ${r.position.toFixed(1)}`);
  });

  // 2. Query Movement (Last 14 days vs Prior 14 days)
  const now1 = new Date();
  const recentEnd = new Date(now1.setDate(now1.getDate() - 1)).toISOString().split('T')[0];
  const recentStart = new Date(now1.setDate(now1.getDate() - 14)).toISOString().split('T')[0];
  
  const now2 = new Date();
  const priorEnd = new Date(now2.setDate(now2.getDate() - 15)).toISOString().split('T')[0];
  const priorStart = new Date(now2.setDate(now2.getDate() - 14)).toISOString().split('T')[0];

  const recentQueries = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: recentStart,
      endDate: recentEnd,
      dimensions: ['query'],
      rowLimit: 25
    }
  });

  const priorQueries = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: priorStart,
      endDate: priorEnd,
      dimensions: ['query'],
      rowLimit: 100
    }
  });

  const priorMap = {};
  (priorQueries.data.rows || []).forEach(r => {
    priorMap[r.keys[0]] = r;
  });

  console.log('\n🔍 KEYWORD POSITION COMPARISON (RECENT 14 DAYS VS PRIOR 14 DAYS):');
  (recentQueries.data.rows || []).forEach(r => {
    const q = r.keys[0];
    const prior = priorMap[q];
    if (prior) {
      const posDiff = (prior.position - r.position).toFixed(1); // Positive = improved, Negative = dropped
      const impDiff = r.impressions - prior.impressions;
      const arrow = posDiff > 0 ? '🟢 UP' : posDiff < 0 ? '🔴 DOWN' : '⚪ SAME';
      console.log(`   • "${q}": Pos ${prior.position.toFixed(1)} -> ${r.position.toFixed(1)} (${arrow} ${posDiff}) | Imp: ${prior.impressions} -> ${r.impressions} (${impDiff >= 0 ? '+' : ''}${impDiff})`);
    } else {
      console.log(`   • "${q}": Pos ${r.position.toFixed(1)} (✨ NEW) | Imp: ${r.impressions}`);
    }
  });

  // 3. Country Breakdown
  const countryRes = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: recentStart,
      endDate: recentEnd,
      dimensions: ['country'],
      rowLimit: 10
    }
  });

  console.log('\n🌍 TOP COUNTRIES BY SEARCH TRAFFIC (RECENT 14 DAYS):');
  (countryRes.data.rows || []).forEach(c => {
    console.log(`   • ${c.keys[0].toUpperCase()} -> Imp: ${c.impressions} | Clicks: ${c.clicks} | Pos: ${c.position.toFixed(1)}`);
  });
}

runAnalysis().catch(console.error);
