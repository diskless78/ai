#include "custom_meta.h"
#include "common.h"


gpointer box_meta_copy_func (gpointer data, gpointer user_data) {
  NvDsUserMeta *user_meta = (NvDsUserMeta *) data;
  BoxData *srcMeta = (BoxData *) user_meta->user_meta_data;
  BoxData *dstMeta = NULL;

  dstMeta = (BoxData *)g_memdup (srcMeta, sizeof(BoxData));

  dstMeta->left = srcMeta->left;
  dstMeta->top = srcMeta->top;
  dstMeta->width = srcMeta->width;
  dstMeta->height = srcMeta->height;

  return dstMeta;
}

void box_meta_free_func (gpointer data, gpointer user_data) {
  NvDsUserMeta *user_meta = (NvDsUserMeta *) data;
  BoxData *srcMeta = (BoxData *) user_meta->user_meta_data;

  g_free (user_meta->user_meta_data);
  user_meta->user_meta_data = NULL;
}

gpointer msg_meta_copy_func (gpointer data, gpointer user_data) {
  NvDsUserMeta *user_meta = (NvDsUserMeta *) data;
  NvDsEventMsgMeta *srcMeta = (NvDsEventMsgMeta *) user_meta->user_meta_data;
  NvDsEventMsgMeta *dstMeta = NULL;

  dstMeta = (NvDsEventMsgMeta *)g_memdup (srcMeta, sizeof(NvDsEventMsgMeta));
  
  if (srcMeta->extMsgSize > 0) {
    dstMeta->extMsg = g_strdup ((gchar*) srcMeta->extMsg);
    dstMeta->extMsgSize = srcMeta->extMsgSize;
  }

  return dstMeta;
}


void msg_meta_free_func (gpointer data, gpointer user_data) {
  NvDsUserMeta *user_meta = (NvDsUserMeta *) data;
  NvDsEventMsgMeta *srcMeta = (NvDsEventMsgMeta *) user_meta->user_meta_data;

  if (srcMeta->extMsgSize > 0) {
    g_free (srcMeta->extMsg);
    srcMeta->extMsg = NULL;
    srcMeta->extMsgSize = 0;
  }

  g_free (user_meta->user_meta_data);
  user_meta->user_meta_data = NULL;
}
