#include "context_utils.h"


bool is_heatmap_roi_id(std::string& ID)
{
  bool flag = false;
  std::string::size_type i = ID.find(HM_ROI_KEY);
  if (i != std::string::npos) {
    flag = true;
    ID.erase(i, std::string(HM_ROI_KEY).length());
  }

  return flag;
}

bool is_line_out_id(std::string& ID, bool rm_key)
{
  bool flag = false;
  std::string::size_type i = ID.find(OUT_LINE_KEY);
  if (ID.find(OUT_LINE_KEY) != std::string::npos) {
    flag = true;
    if (rm_key) ID.erase(i, std::string(OUT_LINE_KEY).length());
  }

  return flag;
}

float cal_stdev(std::vector<float>& v) {
  float sum = std::accumulate(v.begin(), v.end(), 0.0);
  float mean = sum / v.size();

  std::vector<float> diff(v.size());
  std::transform(v.begin(), v.end(), diff.begin(),
                std::bind2nd(std::minus<float>(), mean));
  float sq_sum = std::inner_product(diff.begin(), diff.end(), diff.begin(), 0.0);
  float stdev = std::sqrt(sq_sum / v.size());

  return stdev;
}

float get_stdev_obj(TrackObject* trk) {
  std::vector<POINT>& list_points = trk->list_points;

  std::vector<float> list_cx;
	std::vector<float> list_cy;
  for (auto& p : list_points) {
    list_cx.push_back(p.x);
    list_cy.push_back(p.y);
  }

  float stdev_x = cal_stdev(list_cx);
  // if (isnan(stdev_x)) {
  //   for (auto&x : list_cx) std::cout << x << "-";
  // }
  float stdev_y = cal_stdev(list_cy);

  return (stdev_x+stdev_y) / 2;
}

POINT transform_point(POINT& point, cv::Mat& matrix) {
  std::vector<cv::Point2f> src = {cv::Point2f{point.x, point.y}};
  std::vector<cv::Point2f> dst;

  cv::perspectiveTransform(src, dst, matrix);

  return POINT{dst[0].x, dst[0].y};
}

nlohmann::json create_payload(std::chrono::system_clock::time_point time) {
  nlohmann::json payload;

  payload["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(time.time_since_epoch()).count();
  payload["type"] = "";
  payload["person_id"] = "";
  payload["roi_id"] = "";
  payload["route_id"] = "";
  payload["line_id"] = "";
  payload["dwell_time"] = 0.;
  payload["gender"] = "";
  payload["emb"] = nlohmann::json::value_t::array;
  payload["heatmap"] = nlohmann::json::value_t::array;

  return payload;
}

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
bool onSegment(PolygonPoint p, PolygonPoint q, PolygonPoint r)
{
  if (q.x <= std::max(p.x, r.x) && q.x >= std::min(p.x, r.x) &&
          q.y <= std::max(p.y, r.y) && q.y >= std::min(p.y, r.y))
      return true;
  return false;
}
 
// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
int orientation(PolygonPoint p, PolygonPoint q, PolygonPoint r)
{
  int val = (q.y - p.y) * (r.x - q.x) -
          (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear
  return (val > 0)? 1: 2; // clock or counterclock wise
}
 
// The function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
bool doIntersect(PolygonPoint p1, PolygonPoint q1, PolygonPoint p2, PolygonPoint q2)
{
  // Find the four orientations needed for general and
  // special cases
  int o1 = orientation(p1, q1, p2);
  int o2 = orientation(p1, q1, q2);
  int o3 = orientation(p2, q2, p1);
  int o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4)
      return true;

  // Special Cases
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and p2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}
 
// Returns true if the point p lies inside the polygon[] with n vertices
bool is_centroid_in_roi(std::vector<PolygonPoint> polygon, POINT p)
{
  PolygonPoint pp = {(int)p.x, (int)p.y};
  // Create a point for line segment from p to infinite
  PolygonPoint extreme = {10000, pp.y};
  // Count intersections of the above line with sides of polygon
  int count = 0, i = 0;
  do
  {
      int next = (i+1)%polygon.size();

      // Check if the line segment from 'p' to 'extreme' intersects
      // with the line segment from 'polygon[i]' to 'polygon[next]'
      if (doIntersect(polygon[i], polygon[next], pp, extreme))
      {
          // If the point 'p' is collinear with line segment 'i-next',
          // then check if it lies on segment. If it lies, return true,
          // otherwise false
          if (orientation(polygon[i], pp, polygon[next]) == 0)
          return onSegment(polygon[i], pp, polygon[next]);

          count++;
      }
      i = next;
  } while (i != 0);

  // Return true if count is odd, false otherwise
  return count&1; // Same as (count%2 == 1)
}

uint64_t genPersonID() {
  std::mt19937_64 urng(std::random_device{}());
  std::uniform_int_distribution<uint64_t> distribution;
  uint64_t personID = llabs(distribution(urng));

  return personID;
}

bool is_line_intersection(BoxData box, std::vector<PolygonPoint> entry_line)
{
  // left line of bbox
  PolygonPoint top_left = {(int) box.left, (int) box.top};
  PolygonPoint bottom_left = {(int) box.left, (int) box.top + (int) box.height};
  // right line of bbox
  PolygonPoint top_right = {(int) box.left + (int) box.width, (int) box.top};
  PolygonPoint bottom_right = {(int) box.left + (int) box.width, (int) box.top + (int) box.height};

  if (doIntersect(bottom_left, bottom_right, entry_line[0], entry_line[1])) return true;
  else if (doIntersect(top_left, bottom_left, entry_line[0], entry_line[1])) return true;
  else if (doIntersect(top_right, bottom_right, entry_line[0], entry_line[1])) return true;

  return false;
}