# Q-tiên thiên. Hệ tiên thiên làm mới (thay Q mục 4 cho người chơi)

- Trạng thái: **Chốt hướng 2026-11-06, danh sách chờ bạn duyệt**. Chưa code.
- Thay cho: Q mục 4 (tiên thiên v2) và câu hỏi chờ của chặng 8C trong Z. Phần nào của Q mục 4 không nhắc ở đây thì **bỏ** (cấy, đào, móc vẫn hoãn).
- Liên quan: [Q-giong-truyen](Q-giong-truyen.md) (luật 4 "món quà thành lời nguyền", dàn định mệnh, cảnh lớn, tâm ma 🜏), [Q-khuon-kich-ban](Q-khuon-kich-ban.md) (khe), `js/data/traits.js` (20 tiên thiên cũ), `js/systems/stats.js` (`S.mod`), `js/systems/childhood.js` (`wake`), `js/systems/story.js`, `js/systems/nature.js`, `js/ui/newlife.js`, `js/ui/panels.js`, `js/ui/devpanel.js`.

## 1. Đã chốt (2026-11-06)
1. **Làm mới toàn bộ**: bộ tiên thiên mới `D.TIEN_THIEN` cho người chơi; **20 tiên thiên cũ không dùng cho người chơi nữa** (giữ `D.TRAITS` cho NPC và bản lưu cũ).
2. **Tiên thiên đổi luật truyện**, không chỉ đổi số (mục 4).
3. **Ô Huyết giữ** với 3 huyết mạch đơn giản, mỗi cái có lời nguyền; xương sống "huyết mạch" vẫn hoãn.
4. **Người trong dàn định mệnh có một tiên thiên hiển thị** để kể chuyện (mục 7), không đổi mô phỏng NPC.
5. Giữ từ kế hoạch cũ: **6 ô** (Thể, Cốt, Đồng, Huyết, Mệnh, Tâm), **thêm 3 nhóm ngoài** (Tài, Duyên, Dị; bạn chốt 2026-11-09, mục 3b), tổng **9 nhóm**, mỗi nhóm tối đa một tiên thiên, + **tật** không chiếm nhóm; **mỗi người chỉ có 1 đến 3 tiên thiên, đa số 1 hoặc 2**, không ai có đủ các nhóm; **4 phẩm**; tỉ lệ **Thiên 5%, Quý 15%, Hiếm 30%, Thường 50%**, mỗi lần ra một cái Quý hoặc Thiên thì lần bốc sau tỉ lệ hai phẩm ấy **giảm một nửa**; bốc **1 đến 3** tiên thiên chuẩn + **0 đến 2** tật; xuất thân nghiêng loại hay ra; chỉ người chơi (NPC giữ cách cũ, `baseline --check` phải trùng khít).
6. **Phẩm Quý và Thiên bắt buộc có lời nguyền** (luật 4).
7. Hiệu ứng số **nhỏ** (thế giới tu chậm có chủ ý: khoảng 50 tuổi Luyện Khí, 130 tuổi Trúc Cơ): Quý khoảng +20 đến 30% tu luyện, Thiên khoảng +40 đến 45% kèm lời nguyền nặng.

## 2. Cấu trúc một tiên thiên
```
{ id, n (tên), o: 'the'|'cot'|'dong'|'huyet'|'menh'|'tam'|'tai'|'duyen'|'di'|'tat', p: 0 Thường | 1 Hiếm | 2 Quý | 3 Thiên,
  d (mô tả 1 câu), m: { hiệu chỉnh số, dùng khóa có sẵn của S.mod: hpMax, atk, nl, kv, luck, gold, train, brk, life },
  luat: { khóa luật truyện hoặc mô phỏng người chơi, mục 4 },
  nguyen (lời nguyền, bắt buộc với p ≥ 2: một câu cho người chơi + khóa luat thi hành),
  an: xác suất bị ẩn lúc sinh (Hiếm 0,4; Quý 0,7; Thiên 0,8; Thường và tật 0),
  dau (dấu hiệu khi còn ẩn, 1 câu mơ hồ), the (thẻ xuất thân ưa: p1, p2, p3, p5, t1, t3, t6, t10),
  vai (vai trong dàn hợp với tiên thiên này, cho mục 7) }
```

## 3. Danh sách đợt đầu: sáu nhóm gốc (26 tiên thiên chuẩn + 7 tật = 33; thêm 20 ở mục 3b, tổng 53)
Số liệu là đề xuất, phiên code chỉnh bằng life-sim (mục 8).

### Thể
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Thân như sắt | Thường | sinh lực tối đa +25 | |
| Cốt nhục mau lành | Hiếm | thương tật lành nhanh (thời gian ×0,6), sinh lực +15 | |
| Ngũ hành linh thể (một hệ, theo tư chất cao nhất) | Quý | tư chất hệ ấy +15, tu luyện +20% | **Hương linh thể dẫn dụ yêu thú**: gặp yêu thú, quái nhiều hơn 30% |
| Chí âm / Chí dương chi thể | Thiên | tu luyện +45%, đột phá +6% | **Lò đỉnh trời sinh**: thọ −15%; ma tu và tà tông săn bạn làm lò đỉnh (mở tuyến phụ "kẻ săn lò đỉnh") |

### Cốt
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Cốt cách khá | Thường | công +4, tu luyện +5% | |
| Kiếm cốt | Hiếm | công +8; thắng trận +8% | |
| Đạo cốt | Quý | đột phá +8%, tu luyện +20%, tâm ma −20% | **Bị thèm khát**: kẻ tu tà muốn đào cốt (mở tuyến phụ "kẻ đào cốt", nối T14 về sau) |
| Tiên cốt | Thiên | đột phá +12%, thọ +20% | **Thiên đố anh tài**: mỗi lần đột phá thành công, một người trong dàn gặp họa (thương, bệnh, mất của; không chết nếu chưa đủ luật ba lần) |

### Đồng (mắt, tai, thần thức)
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Mắt tinh | Thường | công +3; tìm thấy tài nguyên, đồ rơi +15% | |
| Thiên lý nhĩ | Hiếm | **luật `nghe`**: ở cảnh lớn hiện thêm một dòng "điều bạn nghe được" | |
| Linh giác | Hiếm | né nguy hiểm +20% (sự kiện xấu, phục kích) | |
| Trùng đồng | Quý | niệm lực +8; **luật `manh`**: manh mối của cú lật được đánh dấu ngay khi gặp | **Bị săn**: kẻ muốn móc mắt (mở tuyến phụ "kẻ săn mắt", nối T13 về sau); dùng nhiều thì đau đầu (đạo tâm −1 mỗi lần đánh dấu manh mối) |
| Thiên nhãn | Thiên | **luật `manh` + `thay_truoc`**: mỗi phần thấy trước một dòng mơ hồ về cao trào sắp tới | **Thấy mà không đổi được**: khi cao trào đến đúng như đã thấy, đạo tâm −3 và tâm ma tăng |

### Huyết (ba huyết mạch đơn giản)
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Hồ huyết | Hiếm | thiện cảm gặp người +, **luật `duyen`**: người thương xuất hiện sớm hơn | |
| Long huyết | Quý | sinh lực +40, công +6, thọ +10% | **Máu rồng nóng**: Tính tình bị kéo dần về phía nóng nảy; tông chính đạo nghi kỵ (thiện cảm khởi đầu −) |
| Phượng huyết | Thiên | **luật `niet_ban`**: chết một lần thì sống lại | **Cái giá của niết bàn**: mất toàn bộ tu vi của cảnh giới đang ở và **quên hẳn một người trong dàn** (gắn bó về 0, người ấy nhớ bạn) |

### Mệnh
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Mệnh hảo | Thường | vận may +3 | |
| Phúc duyên | Hiếm | khí vận khởi đầu +2; mọi vòng quay +3 (vẫn trần +15) | |
| Đại khí vận | Quý | khí vận khởi đầu +4; kỳ ngộ ×1,5 | **Hút vận người khác**: người trong dàn gặp xui nhỏ thường hơn (mất của, thương nhẹ) |
| Mệnh cô tinh | Quý | tu luyện +25%, khí vận +3 | **Cô tinh**: người trong dàn chết sớm hơn; luật ba lần hạ còn **hai** |
| Thiên mệnh chi tử | Thiên | mọi vòng quay +6; kỳ ngộ ×2 | **Thiên Đạo nhìn bạn**: kẻ thù định mệnh dựng sớm và mạnh hơn một bậc; thiên kiếp khó hơn |

### Tâm
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Tâm tĩnh | Thường | niệm lực +5, tâm ma −15% | |
| Ngộ tính | Hiếm | tu luyện +15% | |
| Đạo tâm vững | Hiếm | đạo tâm khởi đầu +10; **luật `vung`**: tính cách trôi chậm (×0,7), lựa chọn tâm ma 🜏 khó hiện hơn | |
| Thất khiếu linh lung | Quý | tu luyện +25%, học công pháp nhanh | **Đa tư**: tính cách dễ đổi (×1,3); đạo tâm thấp thì tâm ma đến nhiều hơn |
| Vô tình đạo tâm | Thiên | đột phá +10%, miễn tâm ma | **Không biết thương**: gắn bó tăng chậm một nửa; lựa chọn `hy_sinh` vì người khác bị khóa khi gắn bó dưới 3 |

### Tật (không chiếm ô; 0 đến 2)
| Tên | Phẩm | Hiệu ứng |
|---|---|---|
| Thể nhược | Thường | sinh lực −20 |
| Lười biếng | Thường | tu luyện −10% |
| Xui xẻo | Thường | vận may −3 |
| Hay quên | Thường | niệm lực −4; "Nhìn lại" sau cú lật thiếu một manh mối |
| Đa bệnh | Hiếm | sinh lực −25, hay đổ bệnh |
| Thọ ngắn | Hiếm | thọ −15% |
| Tâm ma quấn thân | Hiếm | đột phá −6%; **luật `tam_ma`**: lựa chọn tâm ma 🜏 hiện cả khi đạo tâm chưa thấp |

## 3b. Ba nhóm ngoài: Tài, Duyên, Dị (20 tiên thiên; bạn chốt 2026-11-09)
Chia bậc: 6 Thường, 7 Hiếm, 5 Quý, 2 Thiên. Nhóm **Tài** nối với nghề có sẵn (`js/data/jobs.js`: kiem, khi, dan, bua, tho_mo, tho_san, thuong_nhan, linh_danh, y_su).

### Tài (thiên phú nghề)
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Tay khéo | Thường | nghề khí, bùa +15%; vàng kiếm được +10% | |
| Mũi thính thảo dược | Thường | nghề đan +15%; tìm linh thảo +20% | |
| Có khiếu buôn | Thường | mua rẻ hơn 5%, bán đắt hơn 5%; thiện cảm thương hội + | |
| Kiếm tâm bẩm sinh | Hiếm | nghề kiếm +25%; thắng trận +5% | |
| Đan tâm | Hiếm | luyện đan thành công +, phẩm đan cao hơn một bậc thỉnh thoảng | |
| Phù thủ | Hiếm | nghề bùa +25%, vẽ bùa nhanh gấp rưỡi | |
| Thần y thủ | Quý | nghề y +40%; **luật `cuu`**: cứu một người trong dàn khỏi một lần chết vì bệnh hoặc thương | **Y giả không tự y**: thương tật của chính bạn lành chậm ×1,5; người cầu y tìm đến không dứt (sự kiện cầu cứu tốn thời gian, từ chối thì mất danh) |
| Thiên công | Thiên | mọi nghề +40%; thỉnh thoảng làm ra vật phẩm phẩm cao hiếm | **Vật hơn người**: mỗi món phẩm cao bạn làm ra kéo tới một kẻ tranh đoạt (`tranh_doat`); nghề ăn mất thời gian tu (tu luyện −15%) |

### Duyên (người và xã hội)
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Miệng ngọt | Thường | thiện cảm khi giao du +20% | |
| Mặt mũi dễ tin | Thường | thuyết phục, mặc cả, lừa dễ hơn; người ta hay nhờ vả bạn | |
| Quý nhân phù trợ | Hiếm | **luật `quy_nhan`**: mỗi phần kịch bản có một lần người lạ giúp ở cửa ải (thử thách có hạn giảm 20% yêu cầu) | |
| Khí chất lãnh tụ | Hiếm | thu đồ đệ dễ; công đóng góp tông +15%; thăng bậc tông nhanh hơn | |
| Đào hoa | Quý | **luật `duyen` mạnh**: nhiều người nảy tình với bạn | **Nợ tình**: người bị bạn từ chối có thể thành tình địch hoặc kẻ thù; đạo lữ dễ ghen, gắn bó với đạo lữ khó giữ |
| Hiệp danh | Quý | danh vọng ×2 khi làm việc nghĩa | **Danh lớn thì giặc nhiều**: kẻ thách đấu, kẻ ghen danh tìm tới; từ chối người cầu cứu thì mất danh gấp đôi |

### Dị (dị năng)
| Tên | Phẩm | Hiệu ứng | Lời nguyền / ghi chú |
|---|---|---|---|
| Ngủ ít | Thường | nghỉ ngơi ngắn hơn; tu luyện +5% | |
| Giấc mơ báo trước | Hiếm | **luật `mo_bao`**: mỗi phần có một giấc mơ mơ hồ về điều sắp tới (bản nhẹ của Thiên nhãn, không có lời nguyền) | |
| Thú ngữ | Hiếm | yêu thú ít tấn công (gặp yêu thú −25%); có thể thuần một linh thú qua sự kiện | |
| Thông linh | Quý | **luật `thong_linh`**: ở chặng gặt và cao trào, người trong dàn đã chết có thể "nói" một câu | **Âm khí**: thọ −10%; tâm ma đến nhiều hơn; tà tông luyện hồn để ý bạn |
| Bách độc bất xâm | Quý | miễn độc (mưa độc, độc trong sự kiện); sống khỏe ở vùng đầm độc | **Thuốc cũng không vào**: đan dược hồi phục và đột phá chỉ còn nửa hiệu quả |
| Luân hồi ký ức | Thiên | khởi đầu nhớ một công pháp kiếp trước; **luật `tien_kiep`**: mỗi phần hé lộ một mảnh ký ức kiếp trước (đọc Sổ đời nếu có, không thì từ dữ liệu viết sẵn) | **Nợ kiếp trước**: kẻ thù kiếp trước tìm đến (kẻ thù định mệnh dựng sớm); tính cách bị kéo dần về phía tính cách kiếp trước |

## 4. Luật truyện và luật người chơi (bộ máy đọc cờ, rẻ)
| Khóa | Chỗ đọc | Tác dụng |
|---|---|---|
| `nghe` | hộp cảnh lớn | thêm một dòng "điều bạn nghe được" (chữ viết sẵn trong chặng: trường `nghe`; chặng không có thì bỏ qua) |
| `manh` | kế hoạch lật | đánh dấu manh mối ngay khi gặp (tô màu trong nhật ký và "Truyện của đời bạn") |
| `thay_truoc` | mở phần | hiện trước một dòng mơ hồ về cao trào của phần (trường `thay` trong khuôn) |
| `co` | dàn định mệnh | tuổi thọ người trong dàn ×0,8; ngưỡng luật ba lần còn 2 |
| `tam_ma` | thư viện kiểu | lựa chọn 🜏 hiện cả khi đạo tâm chưa thấp |
| `vung` | tính cách | hệ số trôi ×0,7; ngưỡng hiện 🜏 cao hơn |
| `da_tu` | tính cách | hệ số trôi ×1,3 |
| `duyen` | dàn | dựng vai người thương sớm hơn, thiện cảm khởi đầu + |
| `san:<loai>` | tuyến phụ | mở khuôn phụ "kẻ săn" theo loại (lò đỉnh, đào cốt, săn mắt); khuôn phụ viết ở K5 |
| `thien_do` | đột phá thành công | một người trong dàn gặp họa |
| `hut_van` | mỗi năm | xui nhỏ cho người trong dàn |
| `thien_mang` | dàn, đột phá | kẻ thù định mệnh dựng sớm và cao hơn một bậc; thiên kiếp khó hơn |
| `niet_ban` | chết | sống lại một lần, mất tu vi cảnh giới, quên một người |
| `vo_tinh` | gắn bó, kiểu `hy_sinh` | gắn bó ×0,5; khóa `hy_sinh` vì người có gắn bó < 3 |
| `lanh`, `ne`, `tim`, `chien`, `yeu`, `ky_ngo` | mô phỏng người chơi | hệ số thương lành, né nguy, tìm đồ, thắng trận, gặp yêu thú, kỳ ngộ |
| `nghe_<id>` | nghề (`TT.job`, `c.craft`) | hệ số nghề theo id nghề (kiem, khi, dan, bua, y_su...) |
| `cuu` | dàn, chết vì bệnh hoặc thương | cứu một người trong dàn một lần |
| `tranh_doat` | làm ra vật phẩm phẩm cao | sự kiện kẻ tranh đoạt |
| `quy_nhan` | thử thách có hạn | mỗi phần một lần giảm 20% yêu cầu |
| `mo_bao` | mở phần | một giấc mơ mơ hồ (trường `mo` trong khuôn; thiếu thì lấy dòng `thay`) |
| `thong_linh` | chặng gặt, cao trào | một câu của người đã chết trong dàn (trường `linh` trong chặng; thiếu thì bỏ qua) |
| `tien_kiep` | mở phần | một mảnh ký ức kiếp trước |
| `dao_hoa`, `hiep_danh`, `y_gia` | quan hệ, danh, sự kiện | các lời nguyền tương ứng ở mục 3b |

## 5. Ẩn và thức tỉnh
- Ẩn theo `an`; khi ẩn, Hồ sơ hiện ô "???" với **dấu hiệu** (ví dụ Trùng đồng: "Đôi lúc nhìn vào gương, bạn thấy mắt mình có hai đồng tử."), hiệu ứng số **chưa** có, luật truyện **chưa** có, lời nguyền **chưa** có.
- **Cửa thức tỉnh:** (1) hiệu ứng `wake` của tuổi thơ; (2) hộp Tổng kết 12 tuổi (mỗi tiên thiên ẩn 30%); (3) đột phá thành công (50%); (4) **trong cảnh lớn**: hậu quả `fx.tt_thuc` (ví dụ lựa chọn `hy_sinh` đánh thức tiên thiên ẩn mạnh nhất), ghi nhật ký và hiện lời nguyền.
- **Mất:** chỉ qua hậu quả truyện `fx.tt_mat` (ví dụ cấm thuật phản phệ ở khuôn "kiêu hãnh" phần 4).

## 6. Bốc lúc sinh
- Số tiên thiên chuẩn: 1 (50%), 2 (35%), 3 (15%), nên **đa số người có 1 hoặc 2**; mỗi lần bốc: chọn phẩm theo tỉ lệ (có giảm một nửa), rồi chọn tiên thiên trong phẩm ấy **ở nhóm còn trống** (9 nhóm), trọng số ×2 nếu khớp thẻ xuất thân. Tật: 0 (55%), 1 (35%), 2 (10%).
- Bốc bằng **băm** (hạt giống thế giới + id), không gọi `rng`, như tính cách 8A; nút "Bốc lại" trong hộp Đời mới bốc lại cả tiên thiên.
- Tổng số Quý và Thiên tối đa 3.

## 7. Tiên thiên của người trong dàn
- Mỗi vai khi dựng nhận **một tiên thiên hiển thị** từ cùng danh sách (trọng số theo `vai` của tiên thiên: sư phụ hay có Đạo tâm vững, Vô tình đạo tâm; đối thủ hay có Kiếm cốt, Long huyết; bạn thuở nhỏ hay có Thân như sắt, Mệnh hảo...), bốc bằng băm.
- **Chỉ để kể chuyện**: hiện ở hồ sơ người ấy, dùng làm khe trong chữ truyện (`{tt_vai}`), không đổi mô phỏng NPC.

## 8. Cân bằng và kiểm
- `node tools/baseline.js --check` trùng khít (chỉ người chơi). life-sim 40 hạt giống (bản chạy hàng loạt nếu có): tuổi vào Luyện Khí và tỉ lệ chạm Trúc Cơ của người chơi trước và sau, lệch tối đa ±10% so với bộ cũ; phẩm Thiên không vượt +50% tốc độ tổng.
- Kiểm thử: tỉ lệ phẩm và giảm một nửa (băm, 10.000 lần), không quá một mỗi ô, tối đa 3 Quý hoặc Thiên, ẩn và các cửa thức tỉnh, lời nguyền bắt buộc với phẩm ≥ Quý, từng khóa luật, chuyển bản lưu cũ, lưu/tải, công tắc tắt.

## 9. Chuyển bản lưu cũ
- Người chơi đang có `traitIds` cũ: ánh xạ một lần sang bộ mới (Thân cường → Thân như sắt; Mắt tinh → Mắt tinh; Tay khéo → Mắt tinh; Tâm tĩnh → Tâm tĩnh; Mệnh hảo → Mệnh hảo; Ngộ tính cao → Ngộ tính; Phúc duyên → Phúc duyên; Cốt cách thượng thừa → Cốt cách khá; Thiên sinh đạo thể → Đạo cốt; Đại khí vận giả → Đại khí vận; tật cùng tên giữ; Mệnh cô tinh → Mệnh cô tinh), lưu ở `c.tt`, không đổi `TT.VERSION`. NPC giữ `traitIds` cũ.
- Mã cũ đọc `traitIds` (sự kiện cộng tiên thiên, Nghịch Thiên, family, tuổi thơ `bad`) với người chơi chuyển sang đọc `c.tt` qua một hàm chung.

## 10. Chặng làm
| Chặng | Model | Việc |
|---|---|---|
| **TT-d** | Haiku | dữ liệu `js/data/tienthien.js` (`D.TIEN_THIEN`) đúng mục 2, 3, 3b (53 mục): tên, ô, phẩm, mô tả, hiệu ứng, luật, lời nguyền, ẩn, dấu hiệu, thẻ, vai; bài kiểm cú pháp |
| **TT** | Sonnet | cơ chế: bốc (mục 6), ẩn và thức tỉnh (5), luật (4), dàn (7), chuyển bản cũ (9), giao diện (Hồ sơ 6 ô + hàng tật, chip màu theo phẩm, ô ẩn với dấu hiệu, lời nguyền hiện khi đã thức tỉnh; hộp Đời mới; bảng 🛠), đo (8) |

## 11. Nhật ký
- 2026-11-06: lập kế hoạch làm mới, bạn chốt bốn điểm ở mục 1.
- 2026-11-09: bạn chốt thêm **3 nhóm ngoài (Tài, Duyên, Dị) với 20 tiên thiên chia bậc** (mục 3b), tổng 9 nhóm, 46 chuẩn + 7 tật; nhắc lại mỗi người chỉ 1 đến 3 tiên thiên, đa số 1 hoặc 2.
- TT-d đã làm: `js/data/tienthien.js` (`D.TIEN_THIEN` 53 mục, `D.tienThienById`, `D.TIEN_THIEN_RULES` gồm tỉ lệ, giảm một nửa, số lượng, ẩn, cửa thức tỉnh, trần 3, 9 nhóm, bảng chuyển bản cũ); đăng ký trong `js/files.js` sau `traits.js`; bài "Dữ liệu tiên thiên (TT-d)" trong `tests.html` (7 bài, đạt); `baseline --check` trùng khít. Chưa làm: hiệu ứng số của các mục chỉ có chữ (không có khóa trong S.mod) và số trong lời nguyền, chờ chặng TT đấu nối; luật `m`/`luat` dùng object, giá trị là hệ số nhân hoặc `true`.
