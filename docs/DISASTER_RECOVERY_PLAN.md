
# Disaster Recovery Plan - Oakline Bank

## Overview
This document outlines the disaster recovery procedures for the Oakline Bank web application to ensure business continuity and data protection.

## Recovery Time Objectives (RTO)
- **Critical Systems**: 4 hours maximum downtime
- **Database Recovery**: 2 hours maximum
- **Frontend Services**: 1 hour maximum

## Recovery Point Objectives (RPO)
- **Transaction Data**: Maximum 15 minutes data loss
- **User Data**: Maximum 1 hour data loss
- **Configuration Data**: Maximum 4 hours data loss

## Backup Strategy

### Database Backups
- **Frequency**: Every 6 hours via Supabase automated backups
- **Retention**: 30 days for point-in-time recovery
- **Testing**: Weekly restore testing to staging environment

### Application Backups
- **Code Repository**: GitHub with redundant copies
- **Environment Configs**: Terraform state stored in remote backend
- **Media Assets**: Vercel CDN with geographic distribution

## Disaster Scenarios & Procedures

### Scenario 1: Supabase Database Outage
1. **Detection**: Monitoring alerts within 2 minutes
2. **Assessment**: Determine if regional or service-wide
3. **Action**: Activate read-only mode for frontend
4. **Recovery**: Restore from latest backup to secondary region
5. **Verification**: Run integrity checks on restored data

### Scenario 2: Vercel Frontend Outage
1. **Detection**: Health check failures
2. **Action**: Deploy to backup hosting provider
3. **DNS Update**: Switch traffic to backup deployment
4. **Monitoring**: Verify all services operational

### Scenario 3: Complete Regional Outage
1. **Assessment**: Determine scope and estimated duration
2. **Activation**: Deploy full stack to alternate region
3. **Data Sync**: Restore latest backups
4. **Communication**: Notify users via status page
5. **Testing**: Verify all banking functions operational

## Communication Plan
- **Internal Team**: Slack alerts within 5 minutes
- **Management**: Email/SMS within 15 minutes
- **Customers**: Status page update within 30 minutes
- **Regulators**: Formal notice within 24 hours (if required)

## Recovery Verification Checklist
- [ ] All database connections functional
- [ ] Transaction processing working
- [ ] User authentication operational
- [ ] Account balances accurate
- [ ] Audit logs intact
- [ ] Compliance reports accessible
- [ ] External integrations restored

## Automated Recovery Scripts

### Database Failover Script
```bash
#!/bin/bash
# Execute failover to backup region
supabase db failover --project $BACKUP_PROJECT_ID
# Update DNS to point to backup
cloudflare zone-dns update --zone $ZONE_ID --record $RECORD_ID --content $BACKUP_IP
# Verify all services
curl -f https://api.yourdomain.com/health || exit 1
```

### Service Health Verification
```bash
#!/bin/bash
# Test critical banking operations
curl -X POST https://api.yourdomain.com/api/test-transfer \
  -H "Content-Type: application/json" \
  -d '{"test": true}' || exit 1

# Verify user authentication
curl -f https://api.yourdomain.com/api/auth/health || exit 1

# Check database integrity
curl -f https://api.yourdomain.com/api/admin/db-health || exit 1
```

## Post-Incident Review
1. Document timeline and impact
2. Analyze response effectiveness
3. Update procedures based on lessons learned
4. Test improved procedures
5. Update staff training materials

*Last Updated: [Current Date]*
*Next Review: Quarterly*
