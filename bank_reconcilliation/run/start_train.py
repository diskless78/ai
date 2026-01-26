"""
    Convert Label Studio JSON to Hugging Face Dataset for NER Training
"""
import json
import os
import numpy as np
import evaluate
from transformers import (
    AutoTokenizer,
    AutoModelForTokenClassification,
    TrainingArguments,
    Trainer,
    DataCollatorForTokenClassification,
    EarlyStoppingCallback
)
from datasets import Dataset, DatasetDict

# 1. Configure Model & Tokenizer
model_checkpoint = "xlm-roberta-base"
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint, add_prefix_space=True)

# BIO label mapping (Tổng cộng 41 nhãn bao gồm cả O)
label_list = [
    "O",
    "B-KEY_TRANS_DATE", "I-KEY_TRANS_DATE", "B-VALUE_TRANS_DATE", "I-VALUE_TRANS_DATE",
    "B-KEY_REF_NUM", "I-KEY_REF_NUM", "B-VALUE_REF_NUM", "I-VALUE_REF_NUM",
    "B-KEY_DEBT_NUM", "I-KEY_DEBT_NUM", "B-VALUE_DEBT_NUM", "I-VALUE_DEBT_NUM",
    "B-KEY_CRED_NUM", "I-KEY_CRED_NUM", "B-VALUE_CRED_NUM", "I-VALUE_CRED_NUM",
    "B-KEY_ACC_NAME", "I-KEY_ACC_NAME", "B-VALUE_ACC_NAME", "I-VALUE_ACC_NAME",
    "B-KEY_ACC_NUM", "I-KEY_ACC_NUM", "B-VALUE_ACC_NUM", "I-VALUE_ACC_NUM",
    "B-KEY_CIFS", "I-KEY_CIFS", "B-VALUE_CIFS", "I-VALUE_CIFS",
    "B-KEY_CURRENCY_TYPE", "I-KEY_CURRENCY_TYPE", "B-VALUE_CURRENCY_TYPE", "I-VALUE_CURRENCY_TYPE",
    "B-KEY_ACC_ADDR", "I-KEY_ACC_ADDR", "B-VALUE_ACC_ADDR", "I-VALUE_ACC_ADDR",
    "B-KEY_TRANS_DESC", "I-KEY_TRANS_DESC", "B-VALUE_TRANS_DESC", "I-VALUE_TRANS_DESC"
]

label_to_id = {label: i for i, label in enumerate(label_list)}
id_to_label = {i: label for i, label in enumerate(label_list)}


def label_studio_to_hf(json_path):
    if not os.path.exists(json_path):
        print(f"❌ Dataset file not found: {json_path}")
        return []

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    processed_data = []

    for item in data:
        text = item['data']['text']
        results = [ann for ann in item['annotations'][0]['result'] if 'value' in ann and 'labels' in ann['value']]

        results.sort(key=lambda x: x['value']['end'] - x['value']['start'], reverse=True)

        tokenized_input = tokenizer(text, truncation=True, return_offsets_mapping=True, padding=False)
        input_ids = tokenized_input["input_ids"]
        offsets = tokenized_input["offset_mapping"]

        labels = [0] * len(input_ids)

        for ann in results:
            start, end = ann['value']['start'], ann['value']['end']
            label_name = ann['value']['labels'][0]

            first_token = True
            for i, (o_start, o_end) in enumerate(offsets):
                if o_start == o_end:
                    labels[i] = -100
                    continue

                if o_start >= start and o_end <= end:
                    if labels[i] != 0 and labels[i] != -100:
                        continue

                    b_label = f"B-{label_name}"
                    i_label = f"I-{label_name}"

                    if b_label in label_to_id:
                        if first_token:
                            labels[i] = label_to_id[b_label]
                            first_token = False
                        else:
                            labels[i] = label_to_id[i_label]

        processed_data.append({
            "input_ids": input_ids,
            "attention_mask": tokenized_input["attention_mask"],
            "labels": labels
        })

    return processed_data


# 2. Processing the dataset
train_data = label_studio_to_hf("../training/train.json")
val_data = label_studio_to_hf("../training/val.json")
test_data = label_studio_to_hf("../training/test.json")

if train_data:
    print(f"✅ Successfully converted {len(train_data)} tasks to BIO format.")

    sample = next((d for d in train_data if any(l > 0 for l in d['labels'])), None)
    if sample:
        print("\n--- Sample Labeled Tokens ---")
        for i in range(len(sample['input_ids'])):
            token = tokenizer.decode([sample['input_ids'][i]])
            label_id = sample['labels'][i]
            if label_id != 0 and label_id != -100:
                print(f"Token: {token:15} | Label: {label_list[label_id]}")

# 3. Create DatasetDict
raw_datasets = DatasetDict({
    "train": Dataset.from_list(train_data),
    "validation": Dataset.from_list(val_data),
    "test": Dataset.from_list(test_data)
})

# 4. Configure Metrics
metric = evaluate.load("seqeval")


def compute_metrics(p):
    predictions, labels = p
    predictions = np.argmax(predictions, axis=2)

    true_predictions = [
        [label_list[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    true_labels = [
        [label_list[l] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]

    results = metric.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }


# 5. Init Model & Trainer
model = AutoModelForTokenClassification.from_pretrained(
    model_checkpoint,
    num_labels=len(label_list),
    id2label=id_to_label,
    label2id=label_to_id
)

data_collator = DataCollatorForTokenClassification(tokenizer)

training_args = TrainingArguments(
    output_dir="../model/checkpoints",
    eval_strategy="steps",
    eval_steps=20,
    save_strategy="steps",
    save_steps=20,
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=100,
    weight_decay=0.01,
    fp16=True,
    logging_steps=5,
    save_total_limit=2,
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=raw_datasets["train"],
    eval_dataset=raw_datasets["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=5)]
)

# 6. Training & Save
print("\n🚀 Starting training process...")
trainer.train()

final_model_path = "../model/banking_reconciliation_model"
trainer.save_model(final_model_path)
tokenizer.save_pretrained(final_model_path)

print(f"\n✅ Finish Training! Model saved at: {final_model_path}")