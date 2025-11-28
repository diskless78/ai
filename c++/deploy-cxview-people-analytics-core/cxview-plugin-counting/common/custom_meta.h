#pragma once

#include "nvdsmeta.h"
#include "nvdsmeta_schema.h"

gpointer box_meta_copy_func (gpointer data, gpointer user_data);
void box_meta_free_func (gpointer data, gpointer user_data);

gpointer msg_meta_copy_func (gpointer data, gpointer user_data);
void msg_meta_free_func (gpointer data, gpointer user_data);

