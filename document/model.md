- Load JSON & Convert to Token-level BIO
- Create HuggingFace Dataset
- Load Model & Training
- Evaluate & Save
- Inference

tar -cvzf banking_model_v1.tar.gz -C ../model/banking_reconciliation_model .

k8s-platform-ai cp group-mlops/machine-learning-cuda:/opt/ml/bank_reconcilliation/run/banking_model_v1.tar.gz Downloads/banking_model_v1.tar.gz