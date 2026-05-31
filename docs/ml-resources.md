# ML resources

- [Face recognition model (Colab)](https://colab.research.google.com/drive/1NWVkfVhQEDpcPFvKWXasPfq-alJkvEYQ?usp=sharing)
- [Dataset creation (Colab)](https://colab.research.google.com/drive/1NWVkfVhQEDpcPFvKWXasPfq-alJkvEYQ?usp=sharing)

Replace `backend/services/faceRecognitionService.js` with your trained pipeline. The API should return:

```json
{ "matched": true, "confidence": 0.85, "threshold": 0.72, "student": { ... } }
```
