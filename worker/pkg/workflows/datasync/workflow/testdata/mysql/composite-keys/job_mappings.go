
// Code generated by Neosync jobmapping_generator. DO NOT EDIT.
// source: create.sql

package mysql_compositekeys

import (
	mgmtv1alpha1 "github.com/nucleuscloud/neosync/backend/gen/go/protos/mgmt/v1alpha1"
)

func GetDefaultSyncJobMappings()[]*mgmtv1alpha1.JobMapping {
  return []*mgmtv1alpha1.JobMapping{
		{
			Schema: "composite",
			Table:  "orders",
			Column: "order_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "orders",
			Column: "product_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "orders",
			Column: "order_date",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_details",
			Column: "detail_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_details",
			Column: "order_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_details",
			Column: "product_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_details",
			Column: "quantity",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_shipping",
			Column: "shipping_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_shipping",
			Column: "order_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_shipping",
			Column: "product_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "order_shipping",
			Column: "shipping_date",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "shipping_status",
			Column: "status_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "shipping_status",
			Column: "order_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "shipping_status",
			Column: "product_id",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "shipping_status",
			Column: "status",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
		{
			Schema: "composite",
			Table:  "shipping_status",
			Column: "status_date",
			Transformer: &mgmtv1alpha1.JobMappingTransformer{
				Source: mgmtv1alpha1.TransformerSource_TRANSFORMER_SOURCE_PASSTHROUGH,
			},
		},
	} 
}

