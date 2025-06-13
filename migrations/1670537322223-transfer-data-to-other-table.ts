import { MigrationInterface, QueryRunner } from 'typeorm';

export class transferDataToOtherTable1670537322223 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedHistoryStatusQuery = `
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-27 17:00:12.000000', DEFAULT, null, 'approved', 172);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:01.000000', DEFAULT, null, 'completed', 172);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-16 20:10:16.000000', DEFAULT, null, 'approved', 76);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-24 03:42:09.000000', DEFAULT, null, 'completed', 76);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-17 21:29:13.000000', DEFAULT, null, 'approved', 78);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-25 04:43:24.000000', DEFAULT, null, 'completed', 78);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-17 22:46:58.000000', DEFAULT, null, 'approved', 79);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-25 05:03:50.000000', DEFAULT, null, 'completed', 79);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-17 23:07:55.000000', DEFAULT, null, 'approved', 80);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-25 05:04:50.000000', DEFAULT, null, 'completed', 80);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-18 00:35:53.000000', DEFAULT, null, 'approved', 81);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-25 05:42:29.000000', DEFAULT, null, 'completed', 81);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-18 08:08:58.000000', DEFAULT, null, 'approved', 82);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-26 01:21:59.000000', DEFAULT, null, 'completed', 82);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-21 19:38:13.000000', DEFAULT, null, 'approved', 85);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-29 04:23:04.000000', DEFAULT, null, 'completed', 85);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-22 17:15:18.000000', DEFAULT, null, 'approved', 87);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-30 03:22:48.000000', DEFAULT, null, 'completed', 87);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-25 02:03:18.000000', DEFAULT, null, 'approved', 89);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-01 06:23:55.000000', DEFAULT, null, 'completed', 89);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-26 22:15:11.000000', DEFAULT, null, 'approved', 90);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-03 05:22:58.000000', DEFAULT, null, 'completed', 90);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-10-29 13:28:53.000000', DEFAULT, null, 'approved', 95);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-06 02:02:07.000000', DEFAULT, null, 'completed', 95);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-01 01:25:14.000000', DEFAULT, null, 'approved', 103);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-08 05:02:08.000000', DEFAULT, null, 'completed', 103);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-08 20:41:24.000000', DEFAULT, null, 'dispute', 103);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-09 12:23:24.000000', DEFAULT, null, 'dispute', 103);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-03 18:36:59.000000', DEFAULT, null, 'approved', 107);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-11 03:44:53.000000', DEFAULT, null, 'completed', 107);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-05 00:31:50.000000', DEFAULT, null, 'approved', 108);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-12 05:24:22.000000', DEFAULT, null, 'completed', 108);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-29 18:01:43.000000', DEFAULT, null, 'approved', 180);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-07 04:45:00.000000', DEFAULT, null, 'completed', 180);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-05 17:45:22.000000', DEFAULT, null, 'approved', 110);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-13 03:43:41.000000', DEFAULT, null, 'completed', 110);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-08 17:26:32.000000', DEFAULT, null, 'approved', 126);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-16 04:23:52.000000', DEFAULT, null, 'completed', 126);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-08 19:09:23.000000', DEFAULT, null, 'approved', 128);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-16 05:02:32.000000', DEFAULT, null, 'completed', 128);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-09 17:06:53.000000', DEFAULT, null, 'approved', 134);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-17 04:41:16.000000', DEFAULT, null, 'completed', 134);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-10 11:31:23.000000', DEFAULT, null, 'approved', 152);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-18 02:01:47.000000', DEFAULT, null, 'completed', 152);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-15 17:27:44.000000', DEFAULT, null, 'approved', 171);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-15 11:58:55.000000', DEFAULT, null, 'approved', 174);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 174);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-15 23:04:10.000000', DEFAULT, null, 'approved', 173);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-23 23:04:10.000000', DEFAULT, null, 'completed', 173);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-16 00:38:54.000000', DEFAULT, null, 'approved', 175);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 175);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-01 18:45:41.000000', DEFAULT, null, 'approved', 176);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 176);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-16 18:14:14.000000', DEFAULT, null, 'approved', 177);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 177);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-08 13:52:06.000000', DEFAULT, null, 'approved', 181);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-17 13:59:33.000000', DEFAULT, null, 'completed', 159);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-22 04:02:37.000000', DEFAULT, null, 'approved', 159);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-26 23:59:00.000000', DEFAULT, null, 'approved', 167);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-04 06:03:01.000000', DEFAULT, null, 'completed', 167);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-27 15:58:45.000000', DEFAULT, null, 'approved', 168);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 03:21:38.000000', DEFAULT, null, 'completed', 168);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-27 23:47:41.000000', DEFAULT, null, 'approved', 169);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 05:23:37.000000', DEFAULT, null, 'completed', 169);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-28 00:11:42.000000', DEFAULT, null, 'approved', 170);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 05:27:06.000000', DEFAULT, null, 'completed', 170);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-19 21:45:09.000000', DEFAULT, null, 'approved', 178);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 178);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-20 02:05:39.000000', DEFAULT, null, 'approved', 179);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-05 17:00:12.000000', DEFAULT, null, 'completed', 179);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-20 17:00:12.000000', DEFAULT, null, 'approved', 183);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-11-27 17:00:12.000000', DEFAULT, null, 'completed', 183);
    INSERT INTO sales_status_history (id, created_at, updated_at, deleted_at, status, sale_id) VALUES (DEFAULT, '2022-12-14 17:00:12.000000', DEFAULT, null, 'approved', 184);`;

    const deletedSalesQuery = 'DELETE FROM sales WHERE id IN (164,63,35,66,67,68,69,72,73,77,83,86,88,97,102,91,92,165,94,100,101,104,106,113,117,119,166,131,137,160,161,162,163,156,158, 182);';

    const setSalesTransactions = `
    UPDATE transactions SET sale_id = 167 WHERE id = 107;
UPDATE transactions SET sale_id = 170 WHERE id = 120;
UPDATE transactions SET sale_id = 159 WHERE id = 105;
UPDATE transactions SET sale_id = 152 WHERE id = 104;
UPDATE transactions SET sale_id = 179 WHERE id = 118;
UPDATE transactions SET sale_id = 172 WHERE id = 111;
UPDATE transactions SET sale_id = 128 WHERE id = 96;
UPDATE transactions SET sale_id = 169 WHERE id = 109;
UPDATE transactions SET sale_id = 126 WHERE id = 94;
UPDATE transactions SET sale_id = 178 WHERE id = 117;
UPDATE transactions SET sale_id = 177 WHERE id = 116;
UPDATE transactions SET sale_id = 176 WHERE id = 115;
UPDATE transactions SET sale_id = 110 WHERE id = 86;
UPDATE transactions SET sale_id = 108 WHERE id = 84;
UPDATE transactions SET sale_id = 107 WHERE id = 83;
UPDATE transactions SET sale_id = 103 WHERE id = 82;
UPDATE transactions SET sale_id = 168 WHERE id = 108;
UPDATE transactions SET sale_id = 95 WHERE id = 81;
UPDATE transactions SET sale_id = 90 WHERE id = 80;
UPDATE transactions SET sale_id = 89 WHERE id = 79;
UPDATE transactions SET sale_id = 87 WHERE id = 78;
UPDATE transactions SET sale_id = 85 WHERE id = 77;
UPDATE transactions SET sale_id = 82 WHERE id = 76;
UPDATE transactions SET sale_id = 81 WHERE id = 75;
UPDATE transactions SET sale_id = 80 WHERE id = 74;
UPDATE transactions SET sale_id = 79 WHERE id = 73;
UPDATE transactions SET sale_id = 78 WHERE id = 72;
UPDATE transactions SET sale_id = 76 WHERE id = 71;
UPDATE transactions SET sale_id = 180 WHERE id = 112;
UPDATE transactions SET sale_id = 175 WHERE id = 114;
UPDATE transactions SET sale_id = 174 WHERE id = 113;
UPDATE transactions SET sale_id = 173 WHERE id = 110; 
UPDATE transactions SET sale_id = 183 WHERE id = 121; 
INSERT INTO transactions (id, created_at, updated_at, deleted_at, user_id, amount, type, currency, status, stripe_payment_id, transfer_id, sale_id) VALUES (DEFAULT, '0022-11-17 04:41:16.000000', DEFAULT, null, 70, 15120, 'Refill', 'BRL', 'Successes', null, null, 134);
INSERT INTO transactions (id, created_at, updated_at, deleted_at, user_id, amount, type, currency, status, stripe_payment_id, transfer_id, sale_id) VALUES (DEFAULT, '2022-12-08 13:52:06.000000', DEFAULT, null, 63, 20040, 'Refill', 'BRL', 'Pending', null, null, 181);
INSERT INTO transactions (id, created_at, updated_at, deleted_at, user_id, amount, type, currency, status, stripe_payment_id, transfer_id, sale_id) VALUES (DEFAULT, '2022-12-14 13:52:06.000000', DEFAULT, null, 63, 20040, 'Refill', 'BRL', 'Pending', null, null, 184);`;

    if (process.env.NODE_ENV === 'prod') {
      await queryRunner.query(seedHistoryStatusQuery);
      await queryRunner.query(deletedSalesQuery);
      await queryRunner.query(setSalesTransactions);
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
