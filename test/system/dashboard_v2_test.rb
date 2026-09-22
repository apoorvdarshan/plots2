require "application_system_test_case"

class DashboardV2Test < ApplicationSystemTestCase
  Capybara.default_max_wait_time = 60

  test 'trending tags are returned when a user has not subscribed to any topics' do
    log_in_as('user_without_subscriptions')
    visit '/dashboard'
    # Ensure that at least one trending tag is present on the trending and follow section
    assert_selector("div > div.other-topics > span a")
    assert_selector("div#moreTopics div > div > div a")
  end

  test 'view trending topics' do	
    user = users(:bob)	
    subscribed_tags = TagSelection.where(user_id: user.id).pluck(:tid)	
    # Return the name of a subscribed tag at random	
    tag_name = Tag.where(tid: subscribed_tags).pluck(:name).sample	

    log_in_as('Bob')
    visit '/dashboard'
    # Ensure that a subscribed tag is not present on the trending and follow section	
    assert_selector("div > div.other-topics > span a[href='/tag/#{tag_name}']", count: 0)	
    assert_selector("div#moreTopics div > div > div a[href='/tag/#{tag_name}']", count: 0)	
  end

end